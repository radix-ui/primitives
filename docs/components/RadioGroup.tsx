import * as React from 'react';
import {
  Box,
  BoxProps,
  Subheading,
  SubheadingProps,
  Text,
  TextProps,
  Radio as RadixRadio,
  RadioProps as RadixRadioProps,
  theme as radixTheme,
} from '@modulz/radix';
import { useId } from '@interop-ui/react-utils';

const RadioGroupContext = React.createContext<{
  name: string;
  id: string;
  hasLabel: boolean;
  setHasLabel: React.Dispatch<React.SetStateAction<boolean>>;
  hasDesc: boolean;
  setHasDesc: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  setHasDesc() {},
  setHasLabel() {},
} as any);

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { children, name, sx, ...props },
  forwardedRef
) {
  const [hasLabel, setHasLabel] = React.useState(false);
  const [hasDesc, setHasDesc] = React.useState(false);
  const generatedId = useId();
  const id = props.id || `radio-group-${generatedId}`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  return (
    <RadioGroupContext.Provider value={{ name, id, hasLabel, hasDesc, setHasLabel, setHasDesc }}>
      <Box
        role={props.as === 'fieldset' ? undefined : 'group'}
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-describedby={hasDesc ? descriptionId : undefined}
        p={3}
        {...props}
        sx={{
          background: radixTheme.colors.gray200,
          ...sx,
        }}
        id={id}
        ref={forwardedRef}
      >
        {children}
      </Box>
    </RadioGroupContext.Provider>
  );
});

const RadioGroupLabel = React.forwardRef<HTMLHeadingElement, RadioGroupLabelProps>(
  function RadioGroup({ children, id: _, ...props }, forwardedRef) {
    const { id: radioGroupId, setHasLabel } = React.useContext(RadioGroupContext);
    const id = `${radioGroupId}-label`;
    React.useEffect(() => {
      setHasLabel(true);
      return () => {
        setHasLabel(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <Subheading size={0} as="p" {...props} id={id} ref={forwardedRef}>
        {children}
      </Subheading>
    );
  }
);

const RadioGroupDesc = React.forwardRef<HTMLParagraphElement, RadioGroupDescProps>(
  function RadioGroup({ children, id: _, ...props }, forwardedRef) {
    const { id: radioGroupId, setHasDesc } = React.useContext(RadioGroupContext);
    const id = `${radioGroupId}-description`;
    React.useEffect(() => {
      setHasDesc(true);
      return () => {
        setHasDesc(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <Text size={1} as="p" {...props} id={id} ref={forwardedRef}>
        {children}
      </Text>
    );
  }
);

const RadioLabel = React.forwardRef<HTMLLabelElement, RadioLabelProps>(function RadioGroup(
  { children, sx, ...props },
  forwardedRef
) {
  return (
    <Text
      as="label"
      size={2}
      {...props}
      sx={{ display: 'flex', alignItems: 'center', ...sx }}
      ref={forwardedRef as any}
    >
      {children}
    </Text>
  );
});

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function RadioGroup(
  {
    children,
    // @ts-ignore
    name: _,
    ...props
  },
  forwardedRef
) {
  const { name } = React.useContext(RadioGroupContext);
  return <RadixRadio mr={1} {...props} name={name} ref={forwardedRef} />;
});

RadioGroup.displayName = 'RadioGroup';
RadioGroupLabel.displayName = 'RadioGroupLabel';
RadioGroupDesc.displayName = 'RadioGroupDesc';
RadioLabel.displayName = 'RadioLabel';
Radio.displayName = 'Radio';

type RadioGroupProps = BoxProps & {
  name: string;
};

type RadioGroupLabelProps = SubheadingProps & {};

type RadioGroupDescProps = TextProps & {};

type RadioLabelProps = TextProps & {};

type RadioProps = Omit<RadixRadioProps, 'name'> & {};

export type {
  RadioGroupProps,
  RadioGroupLabelProps,
  RadioGroupDescProps,
  RadioLabelProps,
  RadioProps,
};
export { RadioGroup, RadioGroupLabel, RadioGroupDesc, RadioLabel, Radio };
