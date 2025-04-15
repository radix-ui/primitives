import * as React from 'react';
import { RovingFocusProvider, RovingFocusToggle, ButtonGroup, Button } from './roving-focus.client';

export default function Page() {
  return (
    <>
      <h1>Basic</h1>
      <RovingFocusProvider>
        <div>
          <RovingFocusToggle />
        </div>

        <h3>no orientation (both) + no looping</h3>

        <ButtonGroup defaultValue="two">
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>no orientation (both) + looping</h3>

        <ButtonGroup loop>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>horizontal orientation + no looping</h3>

        <ButtonGroup orientation="horizontal">
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>horizontal orientation + looping</h3>

        <ButtonGroup orientation="horizontal" loop>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>vertical orientation + no looping</h3>

        <ButtonGroup orientation="vertical">
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>vertical orientation + looping</h3>

        <ButtonGroup orientation="vertical" loop>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>
      </RovingFocusProvider>

      <h1>Nested</h1>
      <ButtonGroup orientation="vertical" loop>
        <Button value="1">1</Button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button value="2" style={{ marginBottom: 10 }}>
            2
          </Button>

          <ButtonGroup orientation="horizontal" loop>
            <Button value="2.1">2.1</Button>
            <Button value="2.2">2.2</Button>
            <Button disabled value="2.3">
              2.3
            </Button>
            <Button value="2.4">2.4</Button>
          </ButtonGroup>
        </div>

        <Button value="3" disabled>
          3
        </Button>
        <Button value="4">4</Button>
      </ButtonGroup>
    </>
  );
}
