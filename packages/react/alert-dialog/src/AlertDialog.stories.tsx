import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';
import { css } from '../../../../stitches.config';

export default { title: 'Components/AlertDialog' };

export const Styled = () => (
  <AlertDialog>
    <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
    <AlertDialogOverlay className={overlayClass} />
    <AlertDialogContent className={contentClass}>
      <AlertDialogTitle className={titleClass}>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription className={descriptionClass}>
        This will do a very dangerous thing. Thar be dragons!
      </AlertDialogDescription>
      <AlertDialogAction className={actionClass}>yolo, do it</AlertDialogAction>
      <AlertDialogCancel className={cancelClass}>maybe not</AlertDialogCancel>
    </AlertDialogContent>
  </AlertDialog>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  const [housePurchased, setHousePurchased] = React.useState(false);

  return (
    <div>
      <div>
        <img src="https://i.ibb.co/K54hsKt/house.jpg" alt="a large white house with a red roof" />
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          onClick={(e) => {
            if (housePurchased) {
              e.preventDefault();
              setHousePurchased(false);
            }
          }}
        >
          {housePurchased ? 'You bought the house! Sell it!' : 'Buy this house'}
        </AlertDialogTrigger>
        <AlertDialogOverlay className={overlayClass} />
        <AlertDialogContent className={contentClass}>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Houses are very expensive and it looks like you only have €20 in the bank. Maybe consult
            with a financial advisor?
          </AlertDialogDescription>
          <AlertDialogAction className={actionClass} onClick={() => setHousePurchased(true)}>
            buy it anyway
          </AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>good point, I'll reconsider</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const Chromatic = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      height: '100vh',
    }}
  >
    <div>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <AlertDialog>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
        <AlertDialogOverlay className={overlayClass} />
        <AlertDialogContent className={chromaticContentClass}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <h2>Open</h2>
      <AlertDialog defaultOpen>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
        <AlertDialogOverlay
          className={overlayClass}
          style={{ left: 0, bottom: '50%', width: '25%' }}
        />
        <AlertDialogContent className={chromaticContentClass} style={{ top: '25%', left: '12%' }}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <div>
      <h1>Uncontrolled with reordered parts</h1>
      <h2>Closed</h2>
      <AlertDialog>
        <AlertDialogOverlay className={overlayClass} />
        <AlertDialogContent className={chromaticContentClass}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
      </AlertDialog>

      <h2>Open</h2>
      <AlertDialog defaultOpen>
        <AlertDialogOverlay
          className={overlayClass}
          style={{ left: '25%', bottom: '50%', width: '25%' }}
        />
        <AlertDialogContent className={chromaticContentClass} style={{ top: '25%', left: '37%' }}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
      </AlertDialog>
    </div>

    <div>
      <h1>Controlled</h1>
      <h2>Closed</h2>
      <AlertDialog open={false}>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
        <AlertDialogOverlay className={overlayClass} />
        <AlertDialogContent className={chromaticContentClass}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <h2>Open</h2>
      <AlertDialog open>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
        <AlertDialogOverlay
          className={overlayClass}
          style={{ left: '50%', bottom: '50%', width: '25%' }}
        />
        <AlertDialogContent className={chromaticContentClass} style={{ top: '25%', left: '62%' }}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <div>
      <h1>Controlled with reordered parts</h1>
      <h2>Closed</h2>
      <AlertDialog open={false}>
        <AlertDialogOverlay className={overlayClass} />
        <AlertDialogContent className={chromaticContentClass}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
      </AlertDialog>

      <h2>Open</h2>
      <AlertDialog open>
        <AlertDialogOverlay
          className={overlayClass}
          style={{ left: '75%', bottom: '50%', width: '25%' }}
        />
        <AlertDialogContent className={chromaticContentClass} style={{ top: '25%', left: '88%' }}>
          <AlertDialogTitle className={titleClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClass}>Description</AlertDialogDescription>
          <AlertDialogAction className={actionClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
        <AlertDialogTrigger className={triggerClass}>delete everything</AlertDialogTrigger>
      </AlertDialog>
    </div>

    <div>
      <h1>State attributes</h1>
      <h2>Closed</h2>
      <AlertDialog>
        <AlertDialogTrigger className={triggerAttrClass}>delete everything</AlertDialogTrigger>
        <AlertDialogOverlay className={overlayAttrClass} />
        <AlertDialogContent className={contentAttrClass}>
          <AlertDialogTitle className={titleAttrClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionAttrClass}>
            Description
          </AlertDialogDescription>
          <AlertDialogAction className={actionAttrClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelAttrClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <h2>Open</h2>
      <AlertDialog defaultOpen>
        <AlertDialogTrigger className={triggerAttrClass}>delete everything</AlertDialogTrigger>
        <AlertDialogOverlay className={overlayAttrClass} style={{ top: '50%' }} />
        <AlertDialogContent className={contentAttrClass} style={{ top: '75%' }}>
          <AlertDialogTitle className={titleAttrClass}>Title</AlertDialogTitle>
          <AlertDialogDescription className={descriptionAttrClass}>
            Description
          </AlertDialogDescription>
          <AlertDialogAction className={actionAttrClass}>Confirm</AlertDialogAction>
          <AlertDialogCancel className={cancelAttrClass}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

const RECOMMENDED_CSS__ALERT_DIALOG__OVERLAY: any = {
  // ensures overlay is positionned correctly
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const overlayClass = css({
  ...RECOMMENDED_CSS__ALERT_DIALOG__OVERLAY,
  backgroundColor: 'black',
  opacity: 0.2,
});

const RECOMMENDED_CSS__ALERT_DIALOG__CONTENT: any = {
  // ensures good default position for content
  position: 'fixed',
  top: 0,
  left: 0,
};

const contentClass = css({
  ...RECOMMENDED_CSS__ALERT_DIALOG__CONTENT,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  minWidth: 300,
  minHeight: 150,
  padding: 50,
  borderRadius: 10,
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
});

const cancelClass = css({
  appearance: 'none',
  padding: 10,
  border: 'none',
  background: '$grey100',
});

const actionClass = css({
  appearance: 'none',
  padding: 10,
  border: 'none',
  backgroundColor: '$red',
  color: '$white',
});

const titleClass = css({});

const descriptionClass = css({});

const chromaticContentClass = css(contentClass, {
  padding: 10,
  minWidth: 'auto',
  minHeight: 'auto',
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
};
const triggerAttrClass = css(styles);
const overlayAttrClass = css(overlayClass, styles);
const contentAttrClass = css(chromaticContentClass, styles);
const cancelAttrClass = css(styles);
const actionAttrClass = css(styles);
const titleAttrClass = css(styles);
const descriptionAttrClass = css(styles);
