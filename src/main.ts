import * as core from '@actions/core'
import * as github from '@actions/github';
import { Octokit } from "@octokit/rest";

import { wait } from './wait'

const GenUrl = 'http://localhost:8000/v1.0.0/gen_prog/';
const apiKey = 'MqQVfJ6Fq1umZnUI7ZuaycciCjxi3gM0';

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
    const repo = "Auto-Actions";
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
    // const idea = coming_issues

    // const config: AxiosRequestConfig = {
    //   method: 'post',
    //   url: GenUrl,
    //   headers: {
    //     accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     KEY: apiKey,
    //   },
    //   data: {
    //     idea,
    //   },
    // };
    
    // axios(config)
    //   .then((response) => {
    //     core.debug('Response data:', response.data);
    //   })
    //   .catch((error) => {
    //     core.error('Error:', error);
    //   });

    const genRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                  'KEY': apiKey},
      body: JSON.stringify({'idea': coming_issues})
    }
    const response = await fetch(GenUrl, genRequestOptions)
    if (!response.ok) {
      core.debug('Response was not ok!')
    }
    if (response.body !== null) {
      const asString = new TextDecoder("utf-8").decode(response.body);
      const asJSON = JSON.parse(asString);
      const repoName = asJSON['repo_name']
      core.debug(repoName)
    }

    // const submitRequestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json',
    //               'KEY': apiKey},
    //   body: JSON.stringify({'id': 1,
    //                         'name': repoName,
    //                         'local': repoNmae,
    //                         'remote_url':  })
    // }



    

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
