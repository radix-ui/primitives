export const ThemeManager = {
  theme: {
    breakpoints: ['600px', '1000px', '1080px', '1760px'],
    fonts: {
      normal:
        'UntitledSans, -apple-system, BlinkMacSystemFont, "Helvetica Neue", helvetica, arial, sans-serif',
      mono: 'RadixDuo, "Liberation Mono", Menlo, Consolas, monospace',
    },
    fontSizes: [
      '10px',
      '12px',
      '13px',
      '15px',
      '17px',
      '19px',
      '21px',
      '23px',
      '27px',
      '35px',
      '58px',
    ],
    space: ['0', '5px', '10px', '15px', '20px', '25px', '35px', '45px', '65px', '80px'],
    sizes: ['0', '5px', '10px', '15px', '20px', '25px', '35px', '45px', '65px', '80px'],
    lineHeights: ['15px', '20px', '25px', '30px', '35px', '40px', '45px', '50px', '55px', '60px'],
    radii: ['0', '3px', '5px', '10px'],
    colors: {
      black: 'hsl(0, 0%, 0%)',
      white: 'hsl(0, 0%, 100%)',

      gray100: 'hsl(210, 10%, 99%)',
      gray200: 'hsl(210, 25%, 95%)',
      gray300: 'hsl(210, 15%, 90%)',
      gray400: 'hsl(210, 10%, 85%)',
      gray500: 'hsl(210, 10%, 75%)',
      gray600: 'hsl(210, 8%, 62%)',
      gray700: 'hsl(210, 7%, 43%)',
      gray800: 'hsl(210, 7%, 17%)',
      gray900: 'hsl(210, 5%, 9%)',

      blue100: 'hsl(208, 100%, 98%)',
      blue200: 'hsl(208, 100%, 95%)',
      blue300: 'hsl(208, 95%, 90%)',
      blue400: 'hsl(208, 94%, 81%)',
      blue500: 'hsl(208, 95%, 68%)',
      blue600: 'hsl(208, 98%, 50%)',
      blue700: 'hsl(208, 99%, 44%)',
      blue800: 'hsl(208, 98%, 14%)',
      blue900: 'hsl(208, 98%, 9%)',

      red100: 'hsl(348, 100%, 98%)',
      red200: 'hsl(356, 92%, 96%)',
      red300: 'hsl(357, 87%, 91%)',
      red400: 'hsl(358, 90%, 85%)',
      red500: 'hsl(358, 92%, 74%)',
      red600: 'hsl(350, 95%, 52%)',
      red700: 'hsl(348, 97%, 45%)',
      red800: 'hsl(345, 100%, 20%)',
      red900: 'hsl(338, 100%, 12%)',

      green100: 'hsl(150, 80%, 98%)',
      green200: 'hsl(143, 64%, 94%)',
      green300: 'hsl(144, 60%, 86%)',
      green400: 'hsl(145, 59%, 78%)',
      green500: 'hsl(148, 53%, 60%)',
      green600: 'hsl(148, 60%, 42%)',
      green700: 'hsl(150, 70%, 30%)',
      green800: 'hsl(149, 63%, 15%)',
      green900: 'hsl(144, 61%, 8%)',

      yellow100: 'hsl(42, 100%, 98%)',
      yellow200: 'hsl(42, 94%, 93%)',
      yellow300: 'hsl(45, 89%, 86%)',
      yellow400: 'hsl(50, 92%, 74%)',
      yellow500: 'hsl(51, 94%, 66%)',
      yellow600: 'hsl(52, 100%, 49%)',
      yellow700: 'hsl(35, 50%, 39%)',
      yellow800: 'hsl(35, 50%, 15%)',
      yellow900: 'hsl(32, 50%, 8%)',
    },
  },
  setTheme(theme: any) {
    this.theme = theme;
  },
  // TODO: type This here to make this work without casting
  injectTheme() {
    const scales = Object.keys(this.theme);
    for (let i = 0; i < scales.length; i++) {
      const scaleKey = scales[i];
      const scaleValue = (this.theme as any)[scaleKey];
      Object.entries(scaleValue).forEach(([key, value]) => {
        document.body.style.setProperty(`--mdz-${scaleKey}-${key}`, value as string);
      });
    }
  },
};
