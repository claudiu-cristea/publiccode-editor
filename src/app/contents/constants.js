let {REPOSITORY, ELASTIC_URL, VALIDATOR_URL, VALIDATOR_REMOTE_URL} = process.env;

export const privacyPolicyUrl = `https://developers.italia.it/it/privacy-policy/`;
export const repositoryUrl = `https://yml.publiccode.tools`;
export const versionsUrl = `https://api.github.com/repos/${REPOSITORY}/contents/version`;
export const sampleUrl = `https://raw.githubusercontent.com/italia/pc-web-validator/master/tests/valid.minimal.yml`;
export const elasticUrl = ELASTIC_URL || '';
export const validatorUrl = `https://publiccode-validator.developers.italia.it/pc/validate`;
export const validatorRemoteUrl = `https://publiccode-validator.developers.italia.it/pc/validateURL`;
export const APP_FORM = "appForm";
