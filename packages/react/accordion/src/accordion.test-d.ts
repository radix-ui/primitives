import type {
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './index';

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

type _Accordion = AssertOptionalPropsAcceptUndefined<AccordionProps>;
type _AccordionSingle = AssertOptionalPropsAcceptUndefined<AccordionSingleProps>;
type _AccordionMultiple = AssertOptionalPropsAcceptUndefined<AccordionMultipleProps>;
type _AccordionItem = AssertOptionalPropsAcceptUndefined<AccordionItemProps>;
type _AccordionHeader = AssertOptionalPropsAcceptUndefined<AccordionHeaderProps>;
type _AccordionTrigger = AssertOptionalPropsAcceptUndefined<AccordionTriggerProps>;
type _AccordionContent = AssertOptionalPropsAcceptUndefined<AccordionContentProps>;
