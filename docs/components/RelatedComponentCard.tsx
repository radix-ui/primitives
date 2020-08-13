import * as React from 'react';
import { Box, AspectRatio, CardLink, Text } from '@modulz/radix';

type RelatedComponentCardProps = {
  name: string;
  description: string;
  href: string;
};

function RelatedComponentCard({ name, description, href }: RelatedComponentCardProps) {
  return (
    <CardLink href={href} sx={{ padding: 0 }}>
      <AspectRatio ratio="16:9">
        <Box
          sx={{ bg: 'blue200', height: '100%', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
        />
      </AspectRatio>

      <Box sx={{ p: 4 }}>
        <Text as="h6" size={4} sx={{ lineHeight: 1, fontWeight: '500', mb: 2 }}>
          {name}
        </Text>
        <Text as="p" size={3} sx={{ color: 'gray700', lineHeight: 2 }}>
          {description}
        </Text>
      </Box>
    </CardLink>
  );
}

export { RelatedComponentCard };
