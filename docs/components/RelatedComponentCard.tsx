import * as React from 'react';
import { Box, AspectRatio, CardLink, Text, Grid } from '@modulz/radix';
import { componentsPagesById } from '../utils/pages';

function RelatedComponents({ children }: { children: React.ReactNode }) {
  return (
    <Grid sx={{ my: 4, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 5 }}>{children}</Grid>
  );
}

type RelatedComponentCardProps = {
  id: string;
};

function RelatedComponentCard({ id }: RelatedComponentCardProps) {
  const component = componentsPagesById[id];
  return (
    <CardLink href={`/${component.id}`} sx={{ padding: 0 }}>
      <AspectRatio ratio="16:9">
        <Box
          sx={{ bg: 'blue200', height: '100%', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
        />
      </AspectRatio>

      <Box sx={{ p: 4 }}>
        <Text as="h6" size={4} sx={{ lineHeight: 1, fontWeight: '500', mb: 2 }}>
          {component.label}
        </Text>
        <Text as="p" size={3} sx={{ color: 'gray700', lineHeight: 2 }}>
          {component.description}
        </Text>
      </Box>
    </CardLink>
  );
}

export { RelatedComponents, RelatedComponentCard };
