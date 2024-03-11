import * as core from '@actions/core'
import * as github from '@actions/github';
import { Octokit } from "@octokit/rest";

import { wait } from './wait'


// Replace with your authentication method (e.g., personal access token)
const octokit = new Octokit({ auth: "" });

async function getIssueBody(owner: string, repo: string, issueNumber: number) {
  try {
    const response = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    const issue = response.data;
    return issue.body;
  } catch (error) {
    console.error("Error fetching issue:", error);
    // Handle errors appropriately (e.g., throw an error or return a default value)
  }
}



/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const owner = "minhnn-tiny";
    const repo = "MetaGPT_examples";
    const issueNumber = 123;
    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())
    const coming_issues: string = core.getInput('issues')
    core.debug(coming_issues)


    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
