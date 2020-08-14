import React from 'react';
import { Box, Text, Grid, CardLink, Link } from '@modulz/radix';
import {
  Title,
  Description,
  Heading,
  SubHeading,
  Divider,
  Paragraph,
} from '../../components/pageComponents';
import { Principles } from '../../components/Principles';

export default function IntroductionPage() {
  return (
    <>
      <Title hideInQuickNav>Radix</Title>
      <Description>
        An open-source component library for building accessible design systems.
      </Description>

      <Box sx={{ my: 9 }}>
        <Heading>Vision</Heading>
        <Paragraph>
          Most of us share similar definitions for common UI patterns like accordion, checkbox,
          combobox, dialog, dropdown, select, slider, and tooltip. These UI patterns are{' '}
          <Link href="https://www.w3.org/TR/wai-aria-practices/#aria_ex">
            documented by WAI-ARIA
          </Link>{' '}
          and generally understood by the community.
        </Paragraph>
        <Paragraph>
          However, the implementations provided to us by the web platform are inadequate. They're
          either non-existent, lacking in functionality, or cannot be customised sufficiently.
        </Paragraph>
        <Paragraph>
          So, developers are forced to build custom components—an incredibly difficult task. As a
          result, most components on the web are inaccessible, non-performant, and lacking important
          features.
        </Paragraph>
        <Paragraph>
          Our goal is to create a well-funded, open-source component library that the community can
          use to build accessible design systems.
        </Paragraph>
      </Box>

      <Divider />

      <Heading>Principles</Heading>
      <Principles />

      <Divider />

      <Box>
        <Heading>Quick links</Heading>
        <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
          <Box>
            <CardLink variant="shadow">
              <SubHeading hideInQuickNav>Icons</SubHeading>
              <Text as="p" size={3} sx={{ lineHeight: 2, color: 'gray700' }}>
                Short description for this link.
              </Text>
            </CardLink>
          </Box>
          <Box>
            <CardLink variant="shadow">
              <SubHeading hideInQuickNav>Layouts</SubHeading>
              <Text as="p" size={3} sx={{ lineHeight: 2, color: 'gray700' }}>
                Short description for this link.
              </Text>
            </CardLink>
          </Box>
          <Box>
            <CardLink variant="shadow">
              <SubHeading hideInQuickNav>Tutorials</SubHeading>
              <Text as="p" size={3} sx={{ lineHeight: 2, color: 'gray700' }}>
                Short description for this link.
              </Text>
            </CardLink>
          </Box>
          <Box>
            <Link>
              <CardLink variant="shadow" as="a">
                <SubHeading hideInQuickNav>Showcase</SubHeading>
                <Text as="p" size={3} sx={{ lineHeight: 2, color: 'gray700' }}>
                  Short description for this link.
                </Text>
              </CardLink>
            </Link>
          </Box>
        </Grid>
      </Box>

      <Divider />

      <Box>
        <Heading>Frequently asked questions</Heading>
        <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
          <Box>
            <SubHeading hideInQuickNav>Frequently asked question?</SubHeading>
            <Paragraph>
              I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
              Saw your exciting post the other day, congrats on this and the clearly great response
              from the industry per the conversation here.
            </Paragraph>
          </Box>
          <Box>
            <SubHeading hideInQuickNav>Frequently asked question?</SubHeading>
            <Paragraph>
              I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
              Saw your exciting post the other day, congrats on this and the clearly great response
              from the industry per the conversation here.
            </Paragraph>
          </Box>
          <Box>
            <SubHeading hideInQuickNav>Frequently asked question?</SubHeading>
            <Paragraph>
              I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
            </Paragraph>
          </Box>
          <Box>
            <SubHeading hideInQuickNav>Frequently asked question?</SubHeading>
            <Paragraph>
              I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
              Saw your exciting post the other day, congrats on this and the clearly great response
              from the industry per the conversation here.
            </Paragraph>
          </Box>
          <Box>
            <SubHeading hideInQuickNav>Frequently asked question?</SubHeading>
            <Paragraph>
              I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
            </Paragraph>
          </Box>
          <Box>
            <SubHeading hideInQuickNav>Frequently asked question?</SubHeading>
            <Paragraph>
              I hope you're enjoying the first days of summer albeit probably mostly in quarantine!
            </Paragraph>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
