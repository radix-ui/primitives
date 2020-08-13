import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { PrismTheme } from 'prism-react-renderer';
import { Box, theme as radixTheme } from '@modulz/radix';
import { Button } from '@interop-ui/react-button';
import { Input } from '@interop-ui/react-input';
import * as RI from '@modulz/radix-icons';

const componentsExposedToCodeBlock = { Button, Input, ...RI };

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
  children: any;
  live?: boolean;
  removeFragment?: boolean;
};

export function CodeBlock({ children, live = false, removeFragment = false }: CodeBlockProps) {
  return (
    <Box sx={{ mb: 7 }}>
      <LiveProvider
        scope={componentsExposedToCodeBlock}
        theme={theme}
        code={children.trim()}
        transformCode={(code) => (removeFragment ? code : `<>${code}</>`)}
      >
        {live ? (
          <LivePreview
            style={{
              padding: radixTheme.space[3],
              border: `1px solid ${radixTheme.colors.gray300}`,
              borderTopLeftRadius: radixTheme.radii[2],
              borderTopRightRadius: radixTheme.radii[2],
            }}
          />
        ) : null}

        <LiveEditor
          className="react-live-code-block"
          disabled={!live}
          style={{
            fontSize: radixTheme.fontSizes[2],
            fontFamily: radixTheme.fonts.mono,
            fontWeight: 400,
            lineHeight: 1.5,
            borderRadius: radixTheme.radii[2],
            border: `1px solid ${radixTheme.colors.gray300}`,
            ...(live ? { borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {}),
          }}
        />

        {live ? <LiveError /> : null}
      </LiveProvider>
    </Box>
  );
}
