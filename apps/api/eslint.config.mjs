import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  javascript: {
    overrides: {
      "require-await": "off",
    },
  },
});
