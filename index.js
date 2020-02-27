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
  const commitPRs = await githubClient.repos.listPullRequestsAssociatedWithCommit(
    {
      repo: repoName,
      owner: repoOwner,
      commit_sha: context.sha
    }
  );
	const prNumber = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')).pull_request.number

  const codeCoverage = execSync(testCommand).toString();
	const coveragePercentage = (await getPercentage()).toFixed(2)

  const commentBody = `<p>Total Coverage: <code>${coveragePercentage}</code></p>
<details><summary>Coverage report</summary>
<p>
<pre>${codeCoverage}</pre>
</p>
</details>`;

  await githubClient.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber,
  });
};

main().catch(err => core.setFailed(err.message));
