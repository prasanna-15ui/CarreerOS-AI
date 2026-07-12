const brandColor = "#4f46e5"; // Indigo-600
const logoUrl = "https://cdn-icons-png.flaticon.com/512/3253/3253110.png"; // Placeholder brief-case logo

const getBaseTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: ${brandColor};
      padding: 32px 24px;
      text-align: center;
      color: #ffffff;
    }
    .header img {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      filter: brightness(0) invert(1);
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px 24px;
      font-size: 16px;
      line-height: 1.6;
    }
    .content h2 {
      color: #111827;
      font-size: 20px;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: ${brandColor};
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 24px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: ${brandColor};
      text-decoration: none;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .data-table th, .data-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    .data-table th {
      color: #4b5563;
      font-weight: 600;
      width: 40%;
    }
    .data-table td {
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="CareerOS AI Logo">
      <h1>CareerOS AI</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} CareerOS AI. All rights reserved.</p>
      <p>Need help? Contact our <a href="mailto:support@careeros.ai">support team</a>.</p>
    </div>
  </div>
</body>
</html>
`;

export const templates = {
  welcome: (name: string, loginUrl: string = "https://careeros.ai/login") => {
    return getBaseTemplate(
      "Welcome to CareerOS AI 🎉",
      `
        <h2>Welcome aboard, ${name || 'Trailblazer'}!</h2>
        <p>We're thrilled to have you join CareerOS AI. Your account has been successfully created.</p>
        <p>Get ready to supercharge your career with our AI-powered productivity tools, personalized roadmaps, and intelligent resume analyzer.</p>
        <a href="${loginUrl}" class="button">Log in to your Dashboard</a>
      `
    );
  },

  loginAlert: (date: string, browser: string, os: string, ip: string) => {
    return getBaseTemplate(
      "New Login Detected",
      `
        <h2>New Login Alert</h2>
        <p>We noticed a successful login to your CareerOS AI account.</p>
        <table class="data-table">
          <tr><th>Date & Time</th><td>${date}</td></tr>
          <tr><th>Browser</th><td>${browser}</td></tr>
          <tr><th>Operating System</th><td>${os}</td></tr>
          <tr><th>IP Address</th><td>${ip}</td></tr>
        </table>
        <p style="color: #dc2626; font-size: 14px; margin-top: 24px;">
          <strong>If this wasn't you, please change your password immediately.</strong>
        </p>
      `
    );
  },

  loginApprovalRequest: (name: string, approvalUrl: string) => {
    return getBaseTemplate(
      "Login Approval Required",
      `
        <h2>Login Attempt Detected</h2>
        <p>Hi ${name},</p>
        <p>We received a request to log in to your CareerOS AI account. For security purposes, please approve this login request by clicking the button below.</p>
        <a href="${approvalUrl}" class="button">Approve Login</a>
        <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">If you did not initiate this request, you can safely ignore this email.</p>
      `
    );
  },

  loginApprovedConfirmation: (name: string) => {
    return getBaseTemplate(
      "Login Approved ✅",
      `
        <h2>Login Successful</h2>
        <p>Hi ${name},</p>
        <p>Your login request has been successfully approved.</p>
        <p>You can now return to your original tab and access your dashboard.</p>
      `
    );
  },

  resumeUploaded: (filename: string, date: string, tags: string = "N/A") => {
    return getBaseTemplate(
      "Resume Uploaded Successfully",
      `
        <h2>Resume Processed Successfully</h2>
        <p>Your resume has been uploaded successfully.</p>
        <table class="data-table">
          <tr><th>Filename</th><td>${filename}</td></tr>
          <tr><th>Upload Date</th><td>${date}</td></tr>
          <tr><th>Tags</th><td>${tags}</td></tr>
        </table>
        <p>You can now use this resume for the ATS Analyzer and Job Recommendations.</p>
      `
    );
  },

  resumeDeleted: () => {
    return getBaseTemplate(
      "Resume Deleted Successfully",
      `
        <h2>Resume Deleted</h2>
        <p>We've successfully removed your resume from our servers.</p>
        <p>If you need to upload a new one, you can do so anytime from your dashboard.</p>
      `
    );
  },

  placementApplied: (company: string, role: string, date: string) => {
    return getBaseTemplate(
      "Application Submitted Successfully",
      `
        <h2>Application Tracked</h2>
        <p>You've successfully added a new application to your Placement Tracker.</p>
        <table class="data-table">
          <tr><th>Company</th><td>${company}</td></tr>
          <tr><th>Role</th><td>${role}</td></tr>
          <tr><th>Date Applied</th><td>${date}</td></tr>
          <tr><th>Status</th><td>Applied</td></tr>
        </table>
        <p>Fingers crossed! We'll help you prepare for the interview phase.</p>
      `
    );
  },

  placementStatusChanged: (company: string, role: string, oldStatus: string, newStatus: string) => {
    return getBaseTemplate(
      "Placement Status Updated",
      `
        <h2>Status Update</h2>
        <p>Your application status has been updated in the Placement Tracker.</p>
        <table class="data-table">
          <tr><th>Company</th><td>${company}</td></tr>
          <tr><th>Role</th><td>${role}</td></tr>
          <tr><th>Previous Status</th><td><del style="color: #6b7280;">${oldStatus}</del></td></tr>
          <tr><th>New Status</th><td><strong>${newStatus}</strong></td></tr>
        </table>
        <p>Keep the momentum going! Use our AI Interview Mock tool to prepare for upcoming stages.</p>
      `
    );
  },

  taskCompleted: (taskName: string, time: string) => {
    return getBaseTemplate(
      "Task Completed Successfully",
      `
        <h2>Task Checked Off! ✅</h2>
        <p>Congratulations, you have successfully completed your task.</p>
        <table class="data-table">
          <tr><th>Task Name</th><td>${taskName}</td></tr>
          <tr><th>Completion Time</th><td>${time}</td></tr>
        </table>
        <p>Every completed task brings you one step closer to your career goals.</p>
      `
    );
  },

  goalCompleted: (goalTitle: string) => {
    return getBaseTemplate(
      "Congratulations! Goal Completed 🎉",
      `
        <h2>Milestone Reached! 🚀</h2>
        <p>Outstanding work! You've successfully reached 100% on your goal:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center; color: #166534; font-weight: bold; font-size: 18px;">
          ${goalTitle}
        </div>
        <p>Take a moment to celebrate this achievement. We're proud of your progress!</p>
      `
    );
  },

  weeklyReport: (
    completedTasks: number, 
    pendingTasks: number, 
    placementsCount: number, 
    resumesCount: number, 
    recommendationsHtml: string
  ) => {
    return getBaseTemplate(
      "Your Weekly CareerOS AI Progress Report",
      `
        <h2>Weekly Progress Report 📊</h2>
        <p>Here is your career momentum summary for the week:</p>
        
        <table class="data-table">
          <tr><th>Tasks Completed</th><td><span style="color: #16a34a; font-weight: bold;">${completedTasks}</span></td></tr>
          <tr><th>Tasks Pending</th><td>${pendingTasks}</td></tr>
          <tr><th>Active Placements</th><td>${placementsCount}</td></tr>
          <tr><th>Resumes in Vault</th><td>${resumesCount}</td></tr>
        </table>

        <h3 style="margin-top: 32px; color: #111827;">AI Career Recommendations</h3>
        <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 20px; border-radius: 8px;">
          ${recommendationsHtml}
        </div>

        <a href="https://careeros.ai/dashboard" class="button">View Full Dashboard</a>
      `
    );
  }
};
