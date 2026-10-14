import { Label as LabelPrimitive, Slot } from 'radix-ui';
import styles from './label.stories.module.css';
import { customMergeProps } from './custom-merge-props';

const Label = LabelPrimitive.Root;

export default { title: 'Components/Label' };

export const Styled = () => <Label className={styles.root}>Label</Label>;

export const WithControl = () => {
  return (
    <>
      <h1>Wrapping control</h1>
      <Label>
        <Control className={styles.control} /> Label
      </Label>

      <h1>Referencing control</h1>
      <Control id="control" className={styles.control} />
      <Label htmlFor="control">Label</Label>
    </>
  );
};

export const WithInputNumber = (_props: any) => {
  return (
    <Label>
      <span>Name:</span>
      <input type="number" />
    </Label>
  );
};

const Control = (props: any) => {
  return (
    <button className={styles.control} {...props} onClick={() => window.alert('clicked')}>
      Control
    </button>
  );
};

export const WithCustomMergeProps = () => (
  <Slot.Provider mergeProps={customMergeProps}>
    <Label className={styles.root} asChild>
      <span data-custom-merge>Label (asChild)</span>
    </Label>
  </Slot.Provider>
);
