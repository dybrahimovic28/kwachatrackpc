const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('headless');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1380,
    height: 920,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const outputDir = path.join(__dirname, 'test_artifacts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];

  try {
    // Test 1: Verify Auth Modal with Google Sign-In & Forgot Password
    console.log('1. Loading Homepage & Opening Auth Modal...');
    await win.loadURL('http://localhost:4173/#signin');
    await new Promise(r => setTimeout(r, 1200));

    const authCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
        const hasGoogle = buttons.some(b => b.includes('Continue with Google'));
        const hasForgot = buttons.some(b => b.includes('Forgot Password?'));
        const hasBackToHome = buttons.some(b => b.includes('Back to Homepage'));
        return { hasGoogle, hasForgot, hasBackToHome };
      })()
    `);

    results.push({ test: 'Google Sign-In Button Present', success: authCheck.hasGoogle });
    results.push({ test: 'Forgot Password Option Present', success: authCheck.hasForgot });
    results.push({ test: 'Back to Homepage Control in Modal', success: authCheck.hasBackToHome });

    const authImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'auth_modal_google.png'), authImg.toPNG());
    console.log('Saved auth_modal_google.png');

    // Test 2: Enter Dashboard
    console.log('2. Entering Dashboard...');
    // Dismiss modal and click Get Started / demo login to access dashboard
    await win.webContents.executeJavaScript(`
      (() => {
        // Trigger demo mode or navigate to app
        const buttons = Array.from(document.querySelectorAll('button'));
        const closeBtn = buttons.find(b => b.getAttribute('aria-label') === 'Close');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 800));

    // Call exposed demo login to enter authenticated dashboard mode
    await win.webContents.executeJavaScript(`
      (() => {
        if (typeof window.__kwachaDemoLogin === 'function') {
          window.__kwachaDemoLogin();
        }
      })()
    `);
    await new Promise(r => setTimeout(r, 1500));

    // Verify Dashboard is loaded and marketing footer is ABSENT
    const dashboardCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        return {
          hasBalance: text.includes('Total Available Balance') || text.includes('Muli Bwanji'),
          hasNoPremierMarketing: !text.includes("Zambia's premier personal finance management application"),
          hasNoRlsGuarantee: !text.includes('Row Level Security (RLS) Active • Verified Production Artifacts'),
          hasMinimalFooter: text.includes('© 2026 KwachaTrack')
        };
      })()
    `);

    results.push({ test: 'Dashboard Loaded with User Records', success: dashboardCheck.hasBalance });
    results.push({ test: 'Marketing/Tech Descriptions Removed from Dashboard', success: dashboardCheck.hasNoPremierMarketing && dashboardCheck.hasNoRlsGuarantee });
    results.push({ test: 'Minimal Clean Footer Present', success: dashboardCheck.hasMinimalFooter });

    const overviewImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'dashboard_overview.png'), overviewImg.toPNG());
    console.log('Saved dashboard_overview.png');

    // Test 3: Navigate to Transactions Module
    console.log('3. Testing Transactions Tab...');
    await win.webContents.executeJavaScript(`
      (() => {
        const tab = document.getElementById('nav-tab-transactions');
        if (tab) { tab.click(); tab.blur(); }
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const txCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        const inputs = Array.from(document.querySelectorAll('input'));
        const selects = Array.from(document.querySelectorAll('select'));
        return {
          hasSearch: inputs.some(i => (i.placeholder || '').includes('Search by title')),
          hasFilterSelects: selects.length >= 3,
          hasAddBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Record Transaction')),
          hasExportBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Export CSV'))
        };
      })()
    `);

    results.push({ test: 'Transactions Tab: Search & Multi-Filters Active', success: txCheck.hasSearch && txCheck.hasFilterSelects });
    results.push({ test: 'Transactions Tab: Record & CSV Export Actions Available', success: txCheck.hasAddBtn && txCheck.hasExportBtn });

    const txImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'dashboard_transactions.png'), txImg.toPNG());
    console.log('Saved dashboard_transactions.png');

    // Test 4: Navigate to Budgets Module
    console.log('4. Testing Budgets Tab...');
    await win.webContents.executeJavaScript(`
      (() => {
        const tab = document.getElementById('nav-tab-budgets');
        if (tab) { tab.click(); tab.blur(); }
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const budgetCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        return {
          hasHeading: text.includes('Category Budgets'),
          hasCreateBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Create Budget')),
          hasBudgetCardsOrEmpty: text.includes('Overall Budget Utilization') || text.includes('No Budgets Configured')
        };
      })()
    `);

    results.push({ test: 'Budgets Tab: Header & Create Action Present', success: budgetCheck.hasHeading && budgetCheck.hasCreateBtn });
    results.push({ test: 'Budgets Tab: Utilization & Cards Active', success: budgetCheck.hasBudgetCardsOrEmpty });

    const budgetImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'dashboard_budgets.png'), budgetImg.toPNG());
    console.log('Saved dashboard_budgets.png');

    // Test 5: Navigate to Savings Goals Module
    console.log('5. Testing Savings Goals Tab...');
    await win.webContents.executeJavaScript(`
      (() => {
        const tab = document.getElementById('nav-tab-savings');
        if (tab) { tab.click(); tab.blur(); }
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const goalsCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        return {
          hasHeading: text.includes('Savings Goals'),
          hasCreateBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Create Goal')),
          hasGoalsOrEmpty: text.includes('Overall Savings Progress') || text.includes('No Savings Goals Set Yet')
        };
      })()
    `);

    results.push({ test: 'Savings Goals Tab: Header & Create Action Present', success: goalsCheck.hasHeading && goalsCheck.hasCreateBtn });
    results.push({ test: 'Savings Goals Tab: Progress & Cards Active', success: goalsCheck.hasGoalsOrEmpty });

    const goalsImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'dashboard_savings.png'), goalsImg.toPNG());
    console.log('Saved dashboard_savings.png');

    // Test 6: Navigate to Reports & Analytics Module
    console.log('6. Testing Reports Tab...');
    await win.webContents.executeJavaScript(`
      (() => {
        const tab = document.getElementById('nav-tab-reports');
        if (tab) { tab.click(); tab.blur(); }
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const reportsCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        return {
          hasHeading: text.includes('Financial Reports & Analytics'),
          hasPeriodFilters: text.includes('This Month') && text.includes('Last 3 Months') && text.includes('All Time'),
          hasExportBtn: Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Export CSV')),
          hasKpisOrEmpty: text.includes('Total Period Income') || text.includes('No Financial Records')
        };
      })()
    `);

    results.push({ test: 'Reports Tab: Period Selectors (incl. Last 3 Months) Active', success: reportsCheck.hasHeading && reportsCheck.hasPeriodFilters });
    results.push({ test: 'Reports Tab: Visualizations & CSV Export Present', success: reportsCheck.hasExportBtn && reportsCheck.hasKpisOrEmpty });

    const reportsImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'dashboard_reports.png'), reportsImg.toPNG());
    console.log('Saved dashboard_reports.png');

    // Test 7: Verify Bottom of Dashboard (Minimal Footer vs Marketing Removal)
    console.log('7. Testing Minimal Dashboard Footer...');
    await win.webContents.executeJavaScript(`
      (() => {
        const tab = document.getElementById('nav-tab-overview');
        if (tab) { tab.click(); tab.blur(); }
        window.scrollTo(0, document.body.scrollHeight);
      })()
    `);
    await new Promise(r => setTimeout(r, 1200));

    const footerCheck = await win.webContents.executeJavaScript(`
      (() => {
        const text = document.body.innerText;
        return {
          hasMinimalFooter: text.includes('© 2026 KwachaTrack'),
          hasNoTechMotto: !text.includes("Zambia's premier personal finance management application"),
          hasNoKotlinVite: !text.includes('Kotlin') && !text.includes('Vite') && !text.includes('Electron Desktop Architecture'),
          hasNoRlsBadge: !text.includes('Row Level Security (RLS) Active • Verified Production Artifacts')
        };
      })()
    `);

    results.push({
      test: 'Dashboard Footer: Marketing/Tech Blocks Removed & Minimal Copyright Present',
      success: footerCheck.hasMinimalFooter && footerCheck.hasNoTechMotto && footerCheck.hasNoKotlinVite && footerCheck.hasNoRlsBadge
    });

    const footerImg = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outputDir, 'dashboard_footer.png'), footerImg.toPNG());
    console.log('Saved dashboard_footer.png');

    // Print summary
    console.log('\n================ COMPLETE VERIFICATION SUMMARY ================');
    let allPassed = true;
    results.forEach(r => {
      console.log('[' + (r.success ? 'PASS' : 'FAIL') + '] ' + r.test);
      if (!r.success) allPassed = false;
    });
    console.log('===============================================================');

    if (allPassed) {
      console.log('ALL MODULE AND AUTHENTICATION TESTS PASSED!');
    } else {
      console.error('SOME TESTS FAILED!');
    }
  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    app.quit();
  }
});
