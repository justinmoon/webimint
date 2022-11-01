import React from 'react';
import Button from "../components/Button"
import {ArrowRightIcon, CheckIcon, CrossIcon} from '@bitcoin-design/bitcoin-icons-react/filled'

const icons = {
  ArrowRightIcon: <ArrowRightIcon />,
  CheckIcon: <CheckIcon />,
  CrossIcon: <CrossIcon />
}

export default {
  title: 'Webimint/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    style: {
      name: 'Style',
      type: { name: 'string', required: false },
      options: ['filled', 'outline'],
      control: {type: 'radio'}
    },
    size: {
      name: 'Size',
      type: { name: 'string', required: false },
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'}
    },
    icon: {
      name: 'Icon',
      type: { name: 'component', required: false },
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
        labels: {
          ArrowRightIcon: 'Arrow',
          CheckIcon: 'Check',
          CrossIcon: 'Cross'
        }
      }
    },
    iconOnly: {
      name: 'Icon Only',
      type: { name: 'boolean', required: false },
    },
    textOnly: {
      name: 'Text Only',
      type: { name: 'boolean', required: false },
    },
    text: {
      name: 'Text',
      type: { name: 'string', required: false },
    },
  },
};

const Template = (args) => <Button {...args} />;

export const FilledWithIcon = Template.bind({});
FilledWithIcon.args = {
  style: 'filled',
  text: 'Let\'s Go',
  icon: <ArrowRightIcon />,
  iconOnly: false,
  textOnly: false
};

export const OutlineWithIcon = Template.bind({});
OutlineWithIcon.args = {
  style: 'outline',
  text: 'Cancel Send',
  icon: <CrossIcon />,
  iconOnly: false,
  textOnly: false
};
