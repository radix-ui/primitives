import { Label as LabelPrimitive } from 'radix-ui';
import styles from './label.stories.module.css';

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
