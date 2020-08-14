import React from 'react';
import { Box, Text, Flex } from '@modulz/radix';
import { DatePicker } from './DatePicker';

export function FakeComponents() {
  return (
    <>
      <Flex sx={{ alignItems: 'center', userSelect: 'none', pb: 7 }}>
        <Box
          sx={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'gray200',
            px: '3',
            height: '6',
            fontSize: '3',
            fontWeight: '500',
            borderRadius: '2',
            mr: '8',
          }}
        >
          Button
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            textAlign: 'center',
            px: '2',
            height: '4',
            fontSize: '1',
            border: '1px solid',
            borderColor: 'gray300',
            color: 'gray700',
            fontWeight: '500',
            borderRadius: '9999px',
            mr: '8',
          }}
        >
          Badge
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: 'gray200',
            height: '3px',
            width: '100px',
            borderRadius: '9999px',
            position: 'relative',
            mr: '8',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'gray500',
              height: '100%',
              width: '50%',
              borderRadius: '9999px',
            }}
          ></Box>
          <Box
            sx={{
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'gray300',
              boxShadow: '0 1px 3px rgba(0,0,0,.05)',
              height: '15px',
              width: '15px',
              borderRadius: '50%',
              position: 'absolute',
              left: '50%',
              marginLeft: '-7px',
              top: '-5px',
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: 'gray200',
            height: '2',
            width: '150px',
            borderRadius: '9999px',
            position: 'relative',
            mr: '8',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'gray500',
              backgroundImage:
                'linear-gradient(45deg,rgba(255,255,255,.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.2) 50%,rgba(255,255,255,.2) 75%,transparent 75%,transparent)',
              height: '100%',
              width: '50%',
              borderRadius: '9999px 0 0 9999px',
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: 'white',
            borderRadius: '2',
            position: 'relative',
            py: '2',
            mr: '8',
            boxShadow:
              '0 10px 38px -10px rgba(22,23,24,0.35), 0 10px 20px -15px rgba(22,23,24,0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: '6',
              height: '6',
              fontSize: '2',
            }}
          >
            This is a menu item
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: '6',
              height: '6',
              fontSize: '2',
            }}
          >
            Second menu item
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: '6',
              height: '6',
              fontSize: '2',
            }}
          >
            Menu item
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: '6',
              height: '6',
              fontSize: '2',
            }}
          >
            Another menu item
          </Box>
        </Box>
        <DatePicker />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: 'conic-gradient(hsl(208,10%,75%) 68%, hsl(210,15%,90%) 0)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            mr: '8',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              width: '138px',
              height: '138px',
              borderRadius: '50%',
            }}
          >
            <Box
              sx={{
                fontSize: '8',
                color: 'gray900',
              }}
            >
              68%
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: 'gray400',
            height: '3',
            width: '6',
            borderRadius: '9999px',
            mr: '8',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              height: '11px',
              width: '11px',
              margin: '2px',
              borderRadius: '50%',
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '5',
            width: '5',
            border: '1px solid',
            borderColor: 'gray400',
            borderRadius: '50%',
            mr: '8',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'gray600',
              height: '9px',
              width: '9px',
              borderRadius: '50%',
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '5',
            width: '5',
            border: '1px solid',
            borderColor: 'gray400',
            borderRadius: '1',
            mr: '8',
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.467 3.72686C11.7559 3.91576 11.8369 4.30309 11.648 4.592L7.39803 11.092C7.29787 11.2452 7.1356 11.3468 6.95405 11.3699C6.77251 11.3931 6.58992 11.3355 6.4545 11.2124L3.7045 8.71243C3.44909 8.48024 3.43027 8.08496 3.66246 7.82954C3.89465 7.57413 4.28993 7.55531 4.54534 7.7875L6.75295 9.79442L10.6018 3.90793C10.7907 3.61903 11.178 3.53796 11.467 3.72686Z"
              fill="#282B2E"
            />
          </svg>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '6',
            width: '6',
            border: '1px solid',
            borderColor: 'gray300',
            borderRadius: '50%',
            fontSize: '3',
            color: 'gray700',
            mr: '8',
          }}
        >
          A
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '5',
            px: 1,
            border: '1px solid',
            borderColor: 'gray400',
            borderRadius: '1',
            mr: '8',
          }}
        >
          Alert
        </Box>
      </Flex>

      <Flex sx={{ alignItems: 'center', userSelect: 'none', py: 7 }}>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2',
            fontSize: '2',
            borderRadius: '2',
            boxShadow:
              '0 10px 38px -10px rgba(22,23,24,0.35), 0 10px 20px -15px rgba(22,23,24,0.2)',
            mr: '8',
          }}
        >
          <Flex sx={{ alignItems: 'center' }}>
            <Box ml="1">This is a toast message.</Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '5',
                width: '5',
                ml: '1',
                color: 'gray700',
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645C11.1583 3.45118 10.8417 3.45118 10.6464 3.64645L7.5 6.79289L4.35355 3.64645C4.15829 3.45118 3.84171 3.45118 3.64645 3.64645C3.45118 3.84171 3.45118 4.15829 3.64645 4.35355L6.79289 7.5L3.64645 10.6464C3.45118 10.8417 3.45118 11.1583 3.64645 11.3536C3.84171 11.5488 4.15829 11.5488 4.35355 11.3536L7.5 8.20711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L8.20711 7.5L11.3536 4.35355Z"
                  fill="currentColor"
                />
              </svg>
            </Box>
          </Flex>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            width: '200px',
            padding: '3',
            border: '1px solid',
            borderColor: 'gray400',
            borderRadius: '1',
            mr: '8',
          }}
        >
          <Flex sx={{ alignItems: 'center' }}>
            <Box sx={{ mr: '2' }}>
              <Box
                sx={{
                  height: '6',
                  width: '6',
                  backgroundColor: 'gray300',
                  borderRadius: '50%',
                }}
              ></Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  height: '1',
                  backgroundColor: 'gray300',
                  borderRadius: '999px',
                  mb: '2',
                }}
              ></Box>
              <Box
                sx={{
                  height: '1',
                  width: '50%',
                  backgroundColor: 'gray300',
                  borderRadius: '999px',
                }}
              ></Box>
            </Box>
          </Flex>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            height: '6',
            width: '200px',
            px: '2',
            fontSize: '3',
            color: 'gray600',
            border: '1px solid',
            borderColor: 'gray400',
            borderRadius: '1',
            mr: '8',
          }}
        >
          Input
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1',
            fontFamily: 'menlo',
            fontSize: '2',
            border: '1px solid',
            borderColor: 'gray400',
            borderRadius: '2',
            mr: '8',
          }}
        >
          Code
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'gray200',
            px: '3',
            height: '6',
            fontSize: '3',
            borderRadius: '2',
            mr: '8',
          }}
        >
          Select
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2',
            backgroundColor: 'gray900',
            fontSize: '2',
            color: 'white',
            borderRadius: '2',
            mr: '8',
          }}
        >
          Tooltip
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: 'white',
            borderRadius: '3',
            position: 'relative',
            p: '4',
            mr: '8',
            boxShadow:
              '0 10px 38px -10px rgba(22,23,24,0.35), 0 10px 20px -15px rgba(22,23,24,0.2)',
            fontFeatureSettings: "'tnum'",
            width: '400px',
          }}
        >
          <Text
            as="h6"
            weight="medium"
            sx={{
              fontSize: 4,
              mb: 2,
            }}
          >
            Heading
          </Text>
          <Text
            sx={{
              fontSize: 3,
              color: 'gray700',
              mb: 3,
            }}
          >
            Thanks for subscribing on my channel! I will be posting exclusive content on Youtube
            soon! Help me to spread the word!
          </Text>
          <Flex
            sx={{
              justifyContent: 'flex-end',
              mt: 6,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexShrink: 0,
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'gray200',
                px: '3',
                height: '6',
                fontSize: '3',
                fontWeight: '500',
                borderRadius: '2',
              }}
            >
              Cancel
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexShrink: 0,
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: 'gray200',
                px: '3',
                height: '6',
                fontSize: '3',
                fontWeight: '500',
                borderRadius: '2',
                ml: '3',
              }}
            >
              Accept
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
