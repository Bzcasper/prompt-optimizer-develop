# Chrome Extension Publishing Guide

This document provides detailed steps for publishing the Prompt Optimizer to the Chrome Web Store.

## Preparation

### 1. Developer Account Registration

Before uploading the extension, you need to register for a Chrome Web Store developer account:

1. Visit the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
2. Log in with your Google account
3. Pay the one-time $5.00 USD developer registration fee
4. Complete the developer profile setup

### 2. Prepare the Extension Package

1. Ensure the build is complete:
   ```bash
   pnpm build:ext
   ```

2. Package the extension:
   - Locate the built extension directory (usually in `packages/extension/dist`)
   - Package the entire directory as a ZIP file
   - Ensure the root of the ZIP file directly contains `manifest.json`

### 3. Prepare Listing Materials

Based on the checklist in the `chrome.md` file, ensure all required materials are ready:

- Icons of all sizes
- At least 1 screenshot (1280x800 or 640x400 pixels)
- Promotional image (optional, 1400x560 pixels)
- Detailed description text
- Privacy policy page

## Upload Process

1. Visit the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
2. Click the "Add new item" button
3. Upload the ZIP format extension package
4. Fill in the store listing information:
   - Language: Select Chinese and English
   - Store listing: Copy the detailed description from `chrome.md`
   - Category: Select "Productivity" and "Writing Tools"
   - Upload icons, screenshots, and promotional images
   - Fill in the privacy policy link (you can use a privacy policy page hosted on GitHub Pages or Vercel)
5. Before submitting for review, check that all content is complete

## Review Process

The Chrome Web Store review usually takes a few days to two weeks, please be patient.

### Common Review Issues and Solutions

1. **Permission issues**:
   - Ensure that only necessary permissions are requested in `manifest.json`
   - Clearly explain the purpose of each permission in the description

2. **Privacy policy issues**:
   - Ensure the privacy policy is complete and detailed
   - Clearly state how user data is handled

3. **Feature description issues**:
   - Ensure the description is accurate and does not exaggerate features
   - All screenshots must accurately reflect the extension's functionality

4. **Security issues**:
   - Ensure there is no malicious code
   - Avoid using insecure APIs

## Post-launch Maintenance

### Version Updates

1. Increment the version number in `manifest.json`
2. Rebuild the extension
3. Package the new version
4. Upload the new version in the developer console
5. Fill in the update notes
6. Submit for review

### Handling User Feedback

1. Regularly check user reviews and feedback
2. Respond to user questions in a timely manner
3. Improve extension features based on feedback
4. Update the FAQ

## Promotion Strategy

1. **Social media promotion**:
   - Share in technical communities (e.g., Juejin, Zhihu, V2EX, etc.)
   - Create a short demo video
   - Write tutorials and case studies

2. **SEO optimization**:
   - Optimize keywords in the Chrome store description
   - Create a dedicated landing page
   - Write related blog posts

3. **User incentives**:
   - Encourage satisfied users to leave reviews
   - Provide a feedback reward mechanism
   - Build a user community

## Financial Management

1. Set up a Google Merchant Account (if applicable)
2. Set up tax information
3. Set up payment methods
4. Understand the in-app purchase policy (if applicable)

## Resource Links

- [Chrome Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Chrome Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/best_practices/)
- [Google Merchant Support](https://support.google.com/chrome_webstore/)
