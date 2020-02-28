const core = require("@actions/core");
const fs = require("fs");
const coverage = require("coverage-percentage");
const { execSync } = require("child_process");
const { GitHub, context } = require("@actions/github");

function getPercentage() {
  return new Promise(function (resolve, reject) {
    const coveragePercentage = coverage("./coverage/lcov.info", "lcov", function (err, data) {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

const main = async () => {
  const repoName = context.repo.repo;
  const repoOwner = context.repo.owner;
  const githubToken = core.getInput("github-token");
  const testCommand = core.getInput("test-command") || "npx jest";

  const githubClient = new GitHub(githubToken);
  const prNumber = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')).pull_request.number
  const codeCoverage = execSync(testCommand).toString();

  let coveragePercentage = null
  try {
    coveragePercentage = (await getPercentage()).toFixed(2)
  } catch (err) {
    console.log('No coverage report found, exiting...')
    return
  }

  const commentBody = `<div>
    <p>Total Coverage: <code>${coveragePercentage}%</code></p>
      <details><summary>Coverage report</summary>
        <p>
          <pre>${codeCoverage}</pre>
        </p>
      </details>
    </div>`;

  await githubClient.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber,
  });
};

main().catch(err => core.setFailed(err.message));
