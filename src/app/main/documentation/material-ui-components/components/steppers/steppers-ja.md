---
title: Stepper React component
components: MobileStepper, Step, StepButton, StepConnector, StepContent, StepIcon, StepLabel, Stepper
---

# Steppers

<p class="description">Steppers convey progress through numbered steps. It provides a wizard-like workflow.</p>

[Steppers](https://material.io/archive/guidelines/components/steppers.html) display progress through a sequence of logical and numbered steps. They may also be used for navigation. Steppers may display a transient feedback message after a step is saved.

**Types of Steps**

- Editable
- Non-editable
- Mobile
- Optional

**Types of Steppers**

- Horizontal
- Vertical
- Linear
- Non-linear

> **Note:** Steppers are no longer documented in the Material Design documentation.

## Horizontal Linear

The `Stepper` can be controlled by passing the current step index (zero-based) as the `activeStep` property. `Stepper` orientation is set using the `orientation` property.

This example also shows the use of an optional step by placing the `optional` property on the second `Step` component. Note that it's up to you to manage when an optional step is skipped. Once you've determined this for a particular step you must set `completed={false}` to signify that even though the active step index has gone beyond the optional step, it's not actually complete.

{{"demo": "pages/components/steppers/HorizontalLinearStepper.js"}}

## Horizontal Non-linear

Non-linear steppers allow users to enter a multi-step flow at any point.

This example is similar to the regular horizontal stepper, except steps are no longer automatically set to `disabled={true}` based on the `activeStep` property.

We've used the `StepButton` here to demonstrate clickable step labels as well as setting the `completed` flag however because steps can be accessed in a non-linear fashion it's up to your own implementation to determine when all steps are completed (or even if they need to be completed).

{{"demo": "pages/components/steppers/HorizontalNonLinearStepper.js"}}

## Horizontal Linear - Alternative Label

Labels can be placed below the step icon by setting the `alternativeLabel` property on the `Stepper` component.

{{"demo": "pages/components/steppers/HorizontalLinearAlternativeLabelStepper.js"}}

## Horizontal Non Linear - Alternative Label

{{"demo": "pages/components/steppers/HorizontalNonLinearAlternativeLabelStepper.js"}}

## Horizontal Non Linear - Error Step

{{"demo": "pages/components/steppers/HorizontalNonLinearStepperWithError.js"}}

## Vertical Stepper

{{"demo": "pages/components/steppers/VerticalLinearStepper.js"}}

## Customized Stepper

Here is an example of customizing the component. You can learn more about this in the [overrides documentation page](/customization/components/).

This component uses a customized `StepConnector` element that changes border color based on the `active` and `completed` state.

{{"demo": "pages/components/steppers/CustomizedSteppers.js"}}

## Mobile Stepper

This component implements a compact stepper suitable for a mobile device. See [mobile steps](https://material.io/archive/guidelines/components/steppers.html#steppers-types-of-steps) for its inspiration.

### Mobile Stepper - Text

This is essentially a back/next button positioned correctly. You must implement the textual description yourself, however, an example is provided below for reference.

{{"demo": "pages/components/steppers/TextMobileStepper.js"}}

### Mobile Stepper - Text with Carousel effect

This demo is very similar to the previous, the difference is the usage of [react-swipeable-views](https://github.com/oliviertassinari/react-swipeable-views) to make the transition of steps.

{{"demo": "pages/components/steppers/SwipeableTextMobileStepper.js"}}

### Mobile Stepper - Dots

Use dots when the number of steps isn’t large.

{{"demo": "pages/components/steppers/DotsMobileStepper.js"}}

### Mobile Stepper - Progress

Use a progress bar when there are many steps, or if there are steps that need to be inserted during the process (based on responses to earlier steps).

{{"demo": "pages/components/steppers/ProgressMobileStepper.js"}}
