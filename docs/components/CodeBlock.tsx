import * as React from 'react';
import * as CSS from 'csstype';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { PrismTheme } from 'prism-react-renderer';
import { Box, theme as radixTheme, Badge } from '@modulz/radix';
import * as RI from '@modulz/radix-icons';
import * as Collapsible from '@interop-ui/react-collapsible';

const EDITOR_CLASSNAME = 'react-live-code-block';
const EDITOR_STYLES: CSS.Properties = {
  fontSize: radixTheme.fontSizes[2],
  fontFamily: radixTheme.fonts.mono,
  fontWeight: 400,
  lineHeight: 1.5,
  borderRadius: radixTheme.radii[2],
  border: `1px solid ${radixTheme.colors.gray300}`,
};

const componentsExposedToCodeBlock = {
  // Add components in scope for the code block editor here
  React,
  ...Collapsible,
  ...RI,
};

const theme: PrismTheme = {
  plain: {
    color: radixTheme.colors.gray800,
    backgroundColor: radixTheme.colors.gray100,
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#999988', fontStyle: 'italic' },
    },
    {
      types: ['namespace'],
      style: { opacity: 0.7 },
    },
    {
      types: ['string', 'attr-value'],
      style: { color: 'hsl(330, 75%, 45%)' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: radixTheme.colors.gray600 },
    },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted',
      ],
      style: { color: 'hsl(180, 55%, 35%)' },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: { color: 'hsl(195, 90%, 35%)' },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: { color: 'hsl(330, 75%, 45%)' },
    },
    {
      types: ['function-variable'],
      style: { color: 'hsl(180, 50%, 35%)' },
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: { color: radixTheme.colors.blue700 },
    },
  ],
};

type CodeBlockProps = {
  children: string | React.ReactElement<any>;
  live?: boolean;
  className?: string;
  noInline?: boolean;
  isMdx?: boolean;
};

function isString(value: any): value is string {
  return typeof value === 'string';
}

export function CodeBlock({ children, className, isMdx, noInline, ...props }: CodeBlockProps) {
  // To determing the language and code string, we need to analyze children and do some similar
  // comparisons, but we really only need to do that if either the children or classname props
  // change.
  let { code, language } = React.useMemo(() => {
    let code: string;
    let classNameForLanguage: string = '';
    if (React.isValidElement(children)) {
      const childClassName = children.props.className;
      code = isString(children.props.children) ? children.props.children.trim() : '';
      classNameForLanguage = isString(childClassName) ? childClassName : '';
    } else {
      code = isString(children) ? children.trim() : '';
      classNameForLanguage = isString(className) ? className : '';
    }
    return {
      code,
      language: classNameForLanguage?.replace('language-', ''),
    };
  }, [children, className]);

  // The following is a little weird to read, but the goal here is to use comments in mdx code
  // blocks as indicators for how the code block should be rendered. An mdx code block could be live
  // editable or not. If it's live editable, the code may be implicitly renderable with React Live
  // (if it's a singular expression) or it may be more complex, in which case React Live needs to
  // know exactly what to render.
  //
  // So if we're in an mdx code block, we won't have explicit props to deal with. We will indicated
  // that we want to render a live code block with the leading comment `// live`:
  //
  // Example:
  //    ```js
  //    // live
  //    <Collapsible>
  //      <CollapsibleButton>Button</CollapsibleButton>
  //      <CollapsibleContent>Content 1</CollapsibleContent>
  //    </Collapsible>
  //    ```
  let live = props.live;
  if (isMdx) {
    const liveKey = '// live';

    // Only JS is live-renderable. We may want to expand this to support TypeScript, but React Live
    // would need to be forked so we could override its transpilation functionality.
    live = ['jsx', 'js'].includes(language) ? code.startsWith(liveKey) : false;

    // Remove the live comment tag from the code that is ultimately rendered
    code = live ? code.replace(new RegExp(`^${liveKey}(\\n|\\s)*`), '') : code;
  }

  return (
    <Box sx={{ mb: 7 }}>
      <LiveProvider scope={componentsExposedToCodeBlock} theme={theme} code={code}>
        {live ? (
          <LiveCodeBlock code={code} isMdx={isMdx} noInline={noInline} />
        ) : (
          <LiveEditor className={EDITOR_CLASSNAME} disabled style={EDITOR_STYLES} />
        )}
      </LiveProvider>
    </Box>
  );
}

type LiveCodeEditorState = 'idle' | 'focused' | 'editing';

function LiveCodeBlock({
  isMdx,
  code,
  ...props
}: Pick<CodeBlockProps, 'isMdx' | 'noInline'> & { code: string }) {
  // If we are rendering a simple expression in an mdx code block, React Live can handle that
  // without any additional effort. Otherwise we need to explicitly tell it what to render. We will
  // use the `// render` comment to define the argument that should be passed to React Live's
  // renderer.
  let noInline = props.noInline;
  let renderArg = '';
  if (isMdx) {
    const renderKey = '// render';
    const possibleRenderMatch = code.match(
      new RegExp(`${renderKey}([\\n|\\s]+)([\\n|\\s|\\S]*)`, 'm')
    );
    const [fullMatch, , renderableContent] = possibleRenderMatch || [];

    if (renderableContent) {
      noInline = true;

      // If there is a render comment, remove it along with the code that comes after it from the
      // visible code block.
      code = code.replace(fullMatch, '').trim();

      // Reassign the argument to pass to render. Prettier may add a trailing semi-colon so we
      // remove that.
      renderArg = renderableContent.trim().replace(/;$/, '');
    }
  }

  // a11y enhancement: dealing with focus inside of a code block is irritating for keyboard users.
  // The tab key indents code, so focus is essentially locked inside the code block. Instead of
  // focusing the textarea, we want to focus its wrapper and only move focus to the textarea if the
  // user explicitly takes an action to do so. We can move focus to the textarea when a trigger key
  // is pressed (Enter/Spacebar) and return focus back to the wrapper when Escape is pressed.
  //
  // The challenge with React Live is that is bakes in an editor component that renders both the
  // textarea and the wrapper component with a singular React element. There's no way to access the
  // underlying nodes directly via refs, and event handlers appear to be assigned to a different
  // element depending on which event you need. So we have to do this imperatively via DOM
  // listeners.
  const [liveEditorState, setLiveEditorState] = React.useState<LiveCodeEditorState>('idle');
  const boxRef = React.useRef<HTMLDivElement>(null!);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (!boxRef.current) return;

    const liveCodeWrapper: HTMLDivElement | null = boxRef.current.querySelector(
      '[data-live-code-block]'
    );
    const textarea = boxRef.current.querySelector('textarea');

    if (textarea && liveCodeWrapper) {
      textareaRef.current = textarea;
      textarea.tabIndex = -1;

      liveCodeWrapper.addEventListener('focus', handleFocus);
      liveCodeWrapper.addEventListener('blur', handleBlur);
      textarea.addEventListener('focus', textareaHandleFocus);
      textarea.addEventListener('blur', textareaHandleBlur);
      document.addEventListener('keydown', handleKeyDown);

      function handleFocus() {
        setLiveEditorState('focused');
      }

      function handleBlur(event: FocusEvent) {
        if (event.relatedTarget !== textarea) {
          setLiveEditorState('idle');
        }
      }

      function textareaHandleFocus() {
        setLiveEditorState('editing');
      }

      function textareaHandleBlur(event: FocusEvent) {
        if (event.relatedTarget !== liveCodeWrapper) {
          setLiveEditorState('idle');
        }
      }

      function handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
          case 'Enter':
          case 'Spacebar':
          case ' ':
            if (textarea && event.target === liveCodeWrapper) {
              event.preventDefault();
              textarea.focus();
              textarea.setSelectionRange(0, 0);
            }
            break;
          case 'Esc':
          case 'Escape':
            if (event.target === textarea) {
              liveCodeWrapper?.focus();
            }
            break;
        }
      }

      return function () {
        liveCodeWrapper.removeEventListener('focus', handleFocus);
        liveCodeWrapper.removeEventListener('blur', handleBlur);
        textarea.removeEventListener('focus', textareaHandleFocus);
        textarea.removeEventListener('blur', textareaHandleBlur);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return (
    <Box ref={boxRef}>
      <LiveProvider
        scope={componentsExposedToCodeBlock}
        noInline={noInline}
        theme={theme}
        code={code}
        transformCode={renderArg ? (c) => `${c}\nrender(${renderArg})` : undefined}
      >
        <LivePreview
          style={{
            padding: radixTheme.space[3],
            border: `1px solid ${radixTheme.colors.gray300}`,
            borderTopLeftRadius: radixTheme.radii[2],
            borderTopRightRadius: radixTheme.radii[2],
          }}
        />

        <Box
          sx={{
            position: 'relative',
            '&:focus,&:focus-within': {
              outline: 0,
              boxShadow: `0 0 0 3px ${radixTheme.colors.blue400}`,
            },
          }}
        >
          <LiveEditorKeyboardInstructionBadge state={liveEditorState} />
          <LiveEditor
            data-live-code-block=""
            tabIndex={0}
            className={EDITOR_CLASSNAME}
            role="region"
            aria-label="Live code area. Press Enter or Space to edit the code. When editing, press Escape to return to the page context."
            style={{
              ...EDITOR_STYLES,
              borderTop: 'none',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          />
        </Box>
        {process.env.NODE_ENV === 'development' ? <LiveError /> : null}
      </LiveProvider>
    </Box>
  );
}

function LiveEditorKeyboardInstructionBadge({ state }: { state: LiveCodeEditorState }) {
  let bannerText = '';
  switch (state) {
    case 'editing':
      bannerText = 'Press Escape to stop editing';
      break;
    case 'focused':
      bannerText = 'Press Enter or Space to edit';
      break;
    default:
      break;
  }
  return bannerText ? (
    <Badge as="span" sx={{ position: 'absolute', bottom: 1, right: 1, zIndex: 1 }}>
      {bannerText}
    </Badge>
  ) : null;
}
