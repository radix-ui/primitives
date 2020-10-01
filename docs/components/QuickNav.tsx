import * as React from 'react';
import { Box, Heading, Link, Text } from '@modulz/radix';
import { useLayoutEffect } from '@interop-ui/react-utils';

type QuickNavItem = {
  label: string;
  slug: string;
  level: number;
};

const QuickNavContext = React.createContext({
  items: [] as QuickNavItem[],
  setItems: (() => {}) as React.Dispatch<React.SetStateAction<QuickNavItem[]>>,
});

function useQuickNavContext() {
  const context = React.useContext(QuickNavContext);
  if (context === null) {
    throw new Error('No QuickNavContext provided');
  }
  return context;
}

function QuickNavContextProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<QuickNavItem[]>([]);
  return (
    <QuickNavContext.Provider value={{ items, setItems }}>{children}</QuickNavContext.Provider>
  );
}

type QuickNavItemProps = {
  children: React.ReactNode;
  label?: string;
  slug?: string;
  level?: number;
};

function QuickNavItem({
  children,
  label: labelOverride,
  slug: slugOverride,
  level = 0,
}: QuickNavItemProps) {
  const { setItems } = useQuickNavContext();
  const label = labelOverride ?? (typeof children === 'string' ? children : '');
  const slug = slugOverride ?? label.toLowerCase().replace(/\s/g, '-');

  useLayoutEffect(() => {
    setItems((items) => [...items, { label, slug, level }]);
    return () => setItems((items) => items.filter((item) => item.slug !== slug));
  }, [slug, label, level, setItems]);

  return (
    <Box as="span" id={slug} sx={{ scrollMargin: 15 }}>
      {children}
    </Box>
  );
}

function QuickNav() {
  const { items } = useQuickNavContext();

  if (items.length === 0) return null;

  const hierarchicalItems = getHierarchicalItems(items);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '245px',
        flexShrink: 0,
        pt: 7,
        pr: 4,
      }}
    >
      <Heading as="h4" size={1} sx={{ lineHeight: 2, mb: 5, mt: 3 }}>
        Quick nav
      </Heading>
      <nav>
        <QuickNavList items={hierarchicalItems} sx={{ paddingLeft: 0 }} />
      </nav>
    </Box>
  );
}

type QuickNavItemWithChildren = QuickNavItem & { children: QuickNavItemWithChildren[] };

function QuickNavList({ items, sx }: { items: QuickNavItemWithChildren[]; sx?: any }) {
  return (
    <Box as="ul" sx={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: 5, ...sx }}>
      {items.map(({ label, slug, children }) => (
        <Text as="li" size={3} key={slug}>
          <Link href={`#${slug}`} variant="fade" sx={{ display: 'inline-block', py: 1 }}>
            {label}
          </Link>
          {children.length === 0 ? null : <QuickNavList items={children} />}
        </Text>
      ))}
    </Box>
  );
}

function getHierarchicalItems(items: QuickNavItem[]) {
  const hierarchy: QuickNavItemWithChildren[] = [];
  let appendQueue = [hierarchy];

  items.forEach((item, index) => {
    const previousItem = items[index - 1];

    if (previousItem && item.level > previousItem.level) {
      const whereToAppend = appendQueue[appendQueue.length - 1];
      const latestItem = whereToAppend[whereToAppend.length - 1];
      appendQueue.push(latestItem.children);
    } else if (previousItem && item.level < previousItem.level) {
      appendQueue.pop();
    }

    const whereToAppend = appendQueue[appendQueue.length - 1];
    whereToAppend.push({ ...item, children: [] });
  });

  return hierarchy;
}

export { QuickNavContextProvider, QuickNavItem, QuickNav };
