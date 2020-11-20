import * as React from 'react';
import { Button, Box, Flex } from '@modulz/radix';
import { GitHubLogoIcon } from '@modulz/radix-icons';

const PackageMeta: React.FC<PackageMetaProps> = function PackageMeta({
  packageName,
  children,
  ...props
}) {
  const packageDir = packageName.startsWith('react-')
    ? `react/${packageName.replace('react-', '')}`
    : `core/${packageName}`;
  return (
    <Flex as="ul" sx={{ listStyle: 'none', ml: 0, pl: 0, '> * + *': { ml: 2 } }} {...props}>
      <Box as="li">
        <Button
          as="a"
          // @ts-ignore
          href={`https://github.com/modulz/interop-ui/tree/main/packages/${packageDir}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box as="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <GitHubLogoIcon aria-hidden height="1em" width="1em" />
          </Box>
          View Source
        </Button>
      </Box>
      <Box as="li">
        <Button
          as="a"
          // @ts-ignore
          href={`https://www.npmjs.com/package/@interop-ui/${packageName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @interop-ui/{packageName}
        </Button>
      </Box>
      {children}
    </Flex>
  );
};

type PackageMetaProps = { packageName: string };

export type { PackageMetaProps };
export { PackageMeta };
