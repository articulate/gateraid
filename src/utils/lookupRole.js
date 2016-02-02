export default function lookupRole(data) {
  const {
    AWS: { IAM },
    utils: { promisify },
  } = data;

  const iam = new IAM();
  const lookup = promisify(iam.getRole, iam);

  return function(RoleName) {
    return lookup({ RoleName });
  };
}
