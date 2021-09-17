import { Configuration } from 'webpack';

import webpackConfig from '../webpack.config';

export default ({ config: sbConfig }: { config: Configuration }): Configuration => {
  /** Uses our file-loader instead of sb */
  const filteredSbRules = sbConfig.module!.rules
    .filter((rule) => !rule.test!.toString().includes('woff')) 
    .filter((rule) => !rule.test!.toString().includes('.json')) // Let Typescript do it.

  /** Let storybook handle css stuff */
  const rulesWithoutCss = webpackConfig.module!.rules
    .filter((rule) => !rule.test!.toString().includes('.css'))
  
  return {
    ...sbConfig,
    resolve: { ...sbConfig.resolve, ...webpackConfig.resolve, },
    plugins: [ ...webpackConfig.plugins!, ...sbConfig.plugins!, ],
    module: {
      ...sbConfig.module!,
      rules: [
        ...filteredSbRules,
        ...rulesWithoutCss,
      ],
    },
  };
};
