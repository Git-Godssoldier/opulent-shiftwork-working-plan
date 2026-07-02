# ShiftWork training doc to agent deployment PRD

Status: Draft for Opulent internal use

Date: 2026-07-01

Owner: Opulent team

Source structure: Adapted from Matt Pocock's `to-prd` skill structure at https://github.com/mattpocock/skills/tree/main/skills/engineering/to-prd.

## Product context

ShiftWork will run the first call process and give Opulent a completed training document. Opulent owns the part after that document lands. Opulent must turn the document into a working agent, test it, and deliver it on the Opulent platform.

The first proof is a visual quality agent for ShiftWork Studio. The agent monitors `https://shiftworkstudio.ai`, captures screenshots, checks for visible page problems, writes a report, and drafts an alert email when there is an issue.

This PRD is the internal source of truth for decision criteria and first call components that must be present before Opulent starts the build.

## Problem statement

Opulent needs a reliable way to receive a completed ShiftWork training document and turn it into a deployed agent without relying on the original sales call, chat context, or informal notes.

The current client materials create risk because they assign some work to Opulent that the team has now decided ShiftWork owns. The materials also leave gaps around validation, acceptance, delivery, scheduling, customer access, VAPI, model choice, sandboxing, and what happens when the build fails.

The demo risk is simple. If the team demos a build flow without clear decision rules, Dan or Braden can ask a basic question and expose a gap. The biggest gaps are who owns the first call, what makes a training document valid, how the build agent decides what to build, how acceptance works, and what is actually delivered.

## Solution

Build and document a controlled training document to deployment path.

1. ShiftWork owns research, questionnaire selection, answer drafting, first call, call recording, and gap review.
2. ShiftWork places a completed training document in the shared Opulent workspace.
3. Opulent build agent finds the document by schema marker and lead ID.
4. Opulent build agent validates only the fields that block a build. The required fields are the build target and the acceptance test inputs.
5. Opulent build agent runs the full automation modeler flow. This is not a single deploy API.
6. The running agent uses Daytona sandboxing and secrets management.
7. The first demo agent is a visual quality agent for `shiftworkstudio.ai`.
8. The agent supports scheduled runs and manual runs.
9. The agent drafts emails only. It does not send live emails during the proof.
10. Acceptance is run by the system and reviewed by a named human.
11. Opulent owns delivery. ShiftWork schedules the walkthrough and pays runtime costs.

The first proof should show the process from completed training document to built agent, acceptance report, active schedule, manual trigger, and workspace how to guide.

## User stories

1. As ShiftWork crew, I want to place one completed training document into the shared workspace, so that Opulent can start from the same source of truth every time.

2. As ShiftWork crew, I want the training document to include the schema marker `opulent.shiftwork.training_doc.v1`, so that the build agent can search for the right document.

3. As ShiftWork crew, I want the training document to include a lead ID, so that the build agent can find the correct customer record when more than one document exists.

4. As ShiftWork crew, I want the training document to include the owner name, owner email, business name, and selected questionnaire, so that Opulent can tie the build to a specific customer.

5. As ShiftWork crew, I want the training document to say that the first call was handled by crew on Google Meet, so that Opulent does not assume it needs to run VAPI.

6. As ShiftWork crew, I want the training document to include a recording reference, so that humans can review the call later if needed.

7. As Opulent build agent, I want to ignore the recording, so that the build only depends on the text training document.

8. As ShiftWork crew, I want the first call to verify that the owner is the decision maker, so that Opulent does not build from an unapproved request.

9. As ShiftWork crew, I want the first call to capture the build target in the owner's own words, so that the build agent does not infer the target from the questionnaire.

10. As ShiftWork crew, I want the first call to capture whether the target changed from the research guess, so that Opulent can explain why the build target differs from the questionnaire track.

11. As Opulent build agent, I want to read the build target from the document, so that I build the requested agent and not the agent implied by the questionnaire.

12. As Opulent build agent, I want the document to include the target URL, so that I know what site to monitor.

13. As Opulent build agent, I want the no URL path to be explicit, so that I can refuse a visual quality build when there is no URL to monitor.

14. As Opulent build agent, I want the document to include desktop and mobile viewport sizes, so that screenshot checks use the owner's actual requirements.

15. As Opulent build agent, I want the document to include visual issue criteria, so that I know what counts as a problem.

16. As Opulent build agent, I want the document to include alert contents, so that the draft email includes screenshots, URL, viewport, severity, and fix suggestion.

17. As Opulent build agent, I want the document to include alert recipients, so that the agent does not guess who should receive the draft.

18. As Opulent build agent, I want the first proof to stay in draft email mode, so that no live email is sent before connector approval.

19. As Opulent build agent, I want the document to include the schedule, so that I can create the weekday 8 AM Central cron during the build.

20. As Opulent build agent, I want the document to include manual run support, so that the customer can ask for a check outside the schedule.

21. As Opulent build agent, I want the document to include acceptance inputs, so that I can prove the agent works before delivery.

22. As Opulent build agent, I want to run five simple prevalidated checks, so that the proof does not depend on seeded defects on Dan's live site.

23. As Opulent build agent, I want to save screenshots and a report in the workspace, so that the acceptance reviewer can inspect concrete evidence.

24. As Opulent build agent, I want to create the cron during the build, so that the agent is live after acceptance.

25. As Opulent build agent, I want to support a fallback URL, so that the demo can continue if `shiftworkstudio.ai` is down.

26. As Opulent build agent, I want to run in a Daytona sandbox, so that browser work is isolated from the rest of the platform.

27. As Opulent build agent, I want secrets handled through secrets management, so that the agent never sees raw customer credentials.

28. As Opulent build agent, I want screenshot only access, so that the customer does not need to share GitHub, codebase access, or DOM access.

29. As Opulent build agent, I want to use a stronger model for the build, so that the agent can reason about the training document and build flow.

30. As Opulent build agent, I want the running visual quality agent to use a cheaper model, so that recurring runs are cost controlled.

31. As Opulent lead, I want the acceptance test to run automatically, so that every build gets the same test treatment.

32. As Opulent lead, I want a named human to review the acceptance score, so that delivery does not proceed only because the system says pass.

33. As Opulent lead, I want the system to allow two acceptance fix rounds, so that small build issues can be fixed without restarting the process.

34. As Opulent lead, I want a human terminal decision after two failed fix rounds, so that money and scope decisions are not made automatically.

35. As Opulent delivery lead, I want a short Markdown how to guide in the workspace, so that the customer can log in, view runs, read alerts, trigger a run, and understand the schedule.

36. As ShiftWork crew, I want to schedule the walkthrough, so that the customer knows when Opulent will show the delivered agent.

37. As ShiftWork crew, I want Opulent to expose logs after delivery, so that ShiftWork can run the ROI check in.

38. As Dan, I want the first proof to avoid pricing claims, so that the demo does not imply the $29 fee covers the build.

39. As Dan, I want the first proof to target ShiftWork Studio, so that the demo uses the actual dummy app rather than an older placeholder fixture.

40. As Braden, I want the build to show sandboxing, secrets, and run logs, so that security and monitoring concerns are addressed.

41. As the Opulent team, I want Dan's build to run before Braden's, so that the proof handles two pilot builds sequentially.

42. As the Opulent team, I want the Opulent clock to start when the training document lands, so that the seven day expectation is measured from the work Opulent controls.

## Implementation decisions

1. Opulent scope is training document to deployed agent. ShiftWork owns research, questionnaire selection, answer drafting, first call, call recording, and gap review.

2. The training document is the build contract. The document must include schema marker, lead ID, customer identity, selected questionnaire, call information, build target, answers, gap review status, storage location, and pipeline state.

3. The first call components are inputs to Opulent. They are not steps Opulent performs. The required first call components are:

   1. Owner verified as decision maker.
   2. Build target stated by the owner.
   3. Whether the build target changed from the research guess.
   4. URL or explicit no URL state.
   5. Viewports.
   6. Issue criteria.
   7. Alert contents.
   8. Alert recipients.
   9. Schedule and manual run need.
   10. Acceptance inputs.
   11. Gap review sign off.
   12. Recording reference for humans.

4. The build agent only performs minimal validation before starting. It checks that the build target is present and acceptance inputs are present. It trusts ShiftWork on tag enforcement and gap review.

5. If the document has no target URL and the requested agent needs a URL, the build agent refuses and routes the document back to ShiftWork. It does not guess a replacement target.

6. If the document uses an unexpected questionnaire, the build agent still reads the build target. The build target decides what to build.

7. The first proof is a visual quality agent only. The team controls the training document so the build target is visual quality monitoring.

8. The visual quality agent monitors `https://shiftworkstudio.ai`. A fallback URL must be ready for the demo.

9. The visual quality agent captures screenshots at desktop 1280 by 900 and mobile 390 by 844.

10. The visual quality agent uses screenshot evidence only. It does not require codebase access, GitHub access, or DOM access.

11. The visual quality agent checks for the owner stated issue criteria. The criteria include overlap, missing hero image, hidden or unreachable quote button, mobile horizontal scroll, blank section, navigation covering content, cut off form, and console errors.

12. The first proof uses five easy prevalidated criteria. It does not require seeded defects on Dan's live site.

13. Email behavior is draft only for the first proof. The R01 email connector answer remains unconfirmed. Live send needs a later connector approval.

14. The build agent creates the cron during the build. The schedule is weekday 8 AM Central. The agent also supports manual runs from the platform.

15. The build agent uses the full automation modeler flow. The flow produces the automation plan, evaluates it, creates the scheduled agent, creates the manual trigger, and prepares delivery evidence. There is no single build and deploy API in scope.

16. The build uses a stronger model such as Opus or Sonnet. The running visual quality agent uses a cheaper model such as Haiku or an open source model.

17. The built agent runs in a Daytona sandbox. Browser access is used for screenshots. Secrets management holds credentials.

18. Acceptance runs automatically. A named human reviews the score before delivery.

19. Acceptance passes when four of five criteria pass and the must pass case has at least one screenshot and a report.

20. Build failure gets up to three automatic fix attempts. Acceptance failure gets up to two fix rounds.

21. After two failed acceptance rounds, the system stops automatic retries. A human decides whether to rebuild narrower, deliver a partial with credit, or refund and close.

22. Opulent owns delivery. ShiftWork schedules the walkthrough and pays runtime costs.

23. Delivery includes the live agent on the Opulent platform, an active schedule, manual run support, screenshots, report evidence, run logs, and a short Markdown how to guide.

24. Customer login is deferred for the proof unless the demo needs it. The production intent is full workspace access where the customer can see the agent, runs, logs, and configuration.

25. Runtime payer enforcement is deferred for the proof. The production intent is that ShiftWork pays runtime and passes it through.

26. Knowledge aggregation is deferred for the proof. The production intent is that successful runs can feed back into memory and runbooks.

27. Money is not part of the demo. If asked, the $29 fee is the intake trigger. Build pricing is separate and still needs a business decision.

28. Dan and Braden are both required for pilot success. Builds run sequentially, with Dan first and Braden second.

29. The Opulent seven day clock starts when the completed training document lands in the shared workspace.

## Testing decisions

1. Tests should verify external behavior. They should not test implementation details inside the automation modeler or browser tool.

2. The first test checks document retrieval. It creates a training document in the shared workspace, starts a separate reader context, finds the document by schema marker and lead ID, and verifies the build target and acceptance inputs.

3. The second test checks refusal behavior. It gives the build agent a visual quality request with no URL. The expected result is refusal and route back to ShiftWork.

4. The third test checks target selection. It gives the build agent a document where the questionnaire track differs from the build target. The expected result is that the build target wins.

5. The fourth test checks build flow behavior. It starts from a valid training document and expects the build agent to produce a visual quality agent plan, screenshot settings, draft email mode, schedule, manual trigger, and acceptance setup.

6. The fifth test checks scheduled behavior. It verifies weekday 8 AM Central cron creation and manual run support.

7. The sixth test checks visual quality behavior. It runs the agent against five easy prevalidated criteria on the target site or fallback URL. It expects screenshots and a report.

8. The seventh test checks acceptance scoring. It covers five of five pass, four of five pass with the must pass case OK, three of five fail, and two failed fix rounds leading to a terminal human decision.

9. The eighth test checks draft email behavior. It verifies that the agent creates an alert draft and does not send live email.

10. The ninth test checks sandbox and secrets behavior. It verifies that browser work runs in the sandbox and that email credentials are not exposed to the agent.

11. The tenth test checks delivery evidence. It verifies that the workspace has a how to guide, screenshots, report, active schedule, and run logs.

12. The proof should not be marked pass unless screenshots are linked to the report and the report is produced after the prompt, not copied from the prompt.

13. The proof should fail if the platform crashes, the marker appears only in prompt text, the report has no screenshots, or the agent sends a live email.

## Out of scope

1. Opulent does not own ShiftWork research.

2. Opulent does not own questionnaire selection.

3. Opulent does not own Q and A drafting before the call.

4. Opulent does not own the first call.

5. Opulent does not own VAPI.

6. Opulent does not own gap review.

7. Opulent does not build every possible agent type in the first proof.

8. Opulent does not build a manager agent plus task agents in the first proof.

9. Opulent does not send live emails in the first proof.

10. Opulent does not require GitHub, codebase, or DOM access for the visual quality agent.

11. Opulent does not demo pricing.

12. Opulent does not enforce runtime payer setup in the proof.

13. Opulent does not require customer login in the proof unless the demo plan changes.

14. Opulent does not demo knowledge aggregation in the proof.

15. Opulent does not run Dan and Braden in parallel.

## Further notes

1. Runbook override. The Runbook says a named human decides single agent versus orchestrated agent. The demo overrides that. The build agent decides from the document.

2. Runbook follow. The Runbook says a named human reviews acceptance. The demo follows that.

3. Delivery ownership. Pipeline notes say ShiftWork delivers and hosts. The final decision is that Opulent owns delivery. ShiftWork assists with scheduling and payment.

4. First proof URL. Use `shiftworkstudio.ai`. Keep a fallback URL ready.

5. First proof pass bar. The minimum pass is at least one screenshot and report for the must pass case, plus four of five criteria overall.

6. Current test risk. Earlier interop runs found false pass risk when prompt text contained the completion marker. Future tests must separate prompt text from proof.

7. Current platform risk. Earlier hardened runs hit a React 185 crash in the platform. The PRD assumes that platform crash is fixed before a live demo.

8. Team handoff. This PRD should be attached to the implementation issues that cover training document retrieval, build flow, acceptance, delivery, and demo readiness.
