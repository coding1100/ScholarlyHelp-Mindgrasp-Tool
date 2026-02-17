# QA Testing Document - ScholarlyHelp AI Tools

## Document Overview

This document provides comprehensive testing guidelines for all AI tools available in the ScholarlyHelp platform. The tools are located in:

- **Routes**: `/app/(pages)/tools`
- **Components**: `/app/components/AiTools`

---

## Table of Contents

1. [Common Testing Requirements](#common-testing-requirements)
2. [Tool-Specific Testing](#tool-specific-testing)
3. [Multi-Step Flow Tools](#multi-step-flow-tools)
4. [Authentication & Authorization](#authentication--authorization)
5. [Error Handling & Edge Cases](#error-handling--edge-cases)
6. [UI/UX Testing](#uiux-testing)
7. [API Integration Testing](#api-integration-testing)

---

## Common Testing Requirements

### Authentication

- **Requirement**: Most tools require authentication via `access_token` in localStorage
- **Test Cases**:
  - Access tool without authentication → Should redirect to `/sign-in?returnUrl=/tools/{tool-name}`
  - Access tool with expired token → Should redirect to sign-in page
  - Access tool with valid token → Should load tool interface
  - Token verification on page load → Should verify token via `/auth/verify-token` endpoint

### Layout & Navigation

- **Components**: `ToolsLayout.tsx`, `ToolHeader.tsx`, `MTSidebar.tsx`
- **Test Cases**:
  - Sidebar navigation → All tools listed and clickable
  - Mobile sidebar toggle → Should open/close on mobile devices
  - Tool header → Should display correct tool name
  - Dark mode → All components should support dark mode toggle
  - Responsive design → Test on mobile, tablet, desktop viewports

### Common UI Elements

- **Copy to Clipboard**: Test copy functionality on all result displays
- **Clear/Reset**: Test clear buttons reset all form fields
- **Loading States**: Verify loading indicators during API calls
- **Error Messages**: Verify error messages display correctly
- **Toast Notifications**: Test success/error toast messages

---

## Tool-Specific Testing

### 1. Main Tool (`/tools/main-tool`)

**Route**: `app/(pages)/tools/main-tool/page.tsx`  
**Component**: `app/components/AiTools/MainTool/`

#### Features

- Document editor with AI suggestions
- Document management sidebar
- Settings panel
- Download/export functionality
- Publishing options

#### Test Cases

1. **Initial Load**
   - With `?start=1` query param → Should show editor immediately
   - Without query param → Should show prompt modal first
   - Authentication check → Redirects if not authenticated

2. **Document Creation**
   - Create new document → Opens prompt modal
   - Submit prompt → Generates document outline
   - Start writing → Opens editor with outline

3. **Editor Functionality**
   - Text editing → Verify paragraph editor works
   - AI suggestions → Test AI suggestion generation
   - Block toolbar → Test formatting options
   - Word count → Verify real-time word count updates
   - Title editing → Test document title changes

4. **Document Management**
   - Documents sidebar → List all saved documents
   - Select document → Loads document in editor
   - New document → Creates new document
   - Document persistence → Verify documents save correctly

5. **Settings Panel**
   - Open/close settings → Toggle panel visibility
   - Document settings → Test all settings options
   - Download options → Test file format downloads (PDF, DOCX, etc.)
   - Publish document → Test publishing workflow

6. **API Endpoints**
   - Document save → `/api/documents` (POST)
   - Document load → `/api/documents/{id}` (GET)
   - AI suggestions → Verify API calls with proper auth headers

---

### 2. Citation Tool (`/tools/citation-tool`)

**Route**: `app/(pages)/tools/citation-tool/page.tsx`  
**Component**: `app/components/AiTools/CitationTool/CitationTool.tsx`

#### Features

- Multiple citation styles (APA, MLA, Chicago, Harvard)
- Multiple source types (Book, Website, Journal, Article)
- In-text citation generation
- Copy to clipboard

#### Test Cases

1. **Form Validation**
   - Empty form submission → Should show error "At least title or author is required"
   - Only title provided → Should allow submission
   - Only author provided → Should allow submission
   - Both title and author → Should allow submission

2. **Citation Styles**
   - Test all 4 styles: APA, MLA, Chicago, Harvard
   - Verify style dropdown works correctly
   - Verify citation format matches selected style

3. **Source Types**
   - **Book**: Test fields (Author, Title, Publisher, City, Year, Pages)
   - **Website**: Test fields (Author, Title, Website Name, URL, Access Date)
   - **Journal**: Test fields (Author, Title, Journal Name, Volume, Issue, Pages, DOI, Year)
   - **Article**: Test fields (Author, Title, Publication Name, URL, Year)
   - Verify conditional fields show/hide based on source type

4. **API Integration**
   - Endpoint: `/tools/citation-generator` (POST)
   - Verify request payload structure
   - Verify response structure: `{status, citation_style, source_type, full_citation, in_text_citation}`
   - Test with valid data → Should return citations
   - Test with invalid data → Should return error message

5. **Results Display**
   - Full citation display → Verify formatting
   - In-text citation display → Verify shows when `include_in_text` is true
   - Copy buttons → Test copy functionality
   - Error display → Verify error messages show correctly

6. **Edge Cases**
   - Special characters in author/title → Should handle correctly
   - Very long titles → Should display properly
   - Invalid year format → Should validate year input
   - Invalid URL format → Should validate URL input

---

### 3. Essay Outline Tool (`/tools/essay-outline-tool`)

**Route**: `app/(pages)/tools/essay-outline-tool/page.tsx`  
**Component**: `app/components/AiTools/EssayOutline-tool.tsx`

#### Features

- Topic input
- Essay level selection
- Essay type selection
- Outline generation with sections and subsections

#### Test Cases

1. **Form Input**
   - Topic field → Required, text input
   - Essay level dropdown → Test all options
   - Essay type dropdown → Test all options
   - Form validation → Verify required fields

2. **API Integration**
   - Endpoint: `/tools/essay-outline` (POST)
   - Payload: `{topic, essay_level, essay_type}`
   - Verify response structure: `{data: {outline: [{section, subsections[]}]}}`

3. **Results Display**
   - Outline structure → Verify sections and subsections display
   - Copy functionality → Test copy button
   - Empty state → Verify "No outline generated yet" message
   - Loading state → Verify loading indicator

4. **Error Handling**
   - API error → Verify error toast displays
   - Network error → Verify error handling
   - Invalid topic → Verify validation

---

### 4. Essay Title Generator (`/tools/essay-title`)

**Route**: `app/(pages)/tools/essay-title/page.tsx`  
**Component**: `app/components/AiTools/EssayTitle/EssayTitle.tsx`

#### Features

- Topic or keywords input
- Tone selection (Formal, Creative, Research-based)
- Count selection (1-10 titles)
- Multiple title generation

#### Test Cases

1. **Form Validation**
   - Empty topic and keywords → Error: "Please provide either a topic or keywords"
   - Topic only → Should allow submission
   - Keywords only → Should allow submission
   - Both topic and keywords → Should allow submission

2. **Tone Selection**
   - Test all 3 tones: Formal, Creative, Research-based
   - Verify tone affects generated titles

3. **Count Selection**
   - Test count range: 1-10
   - Verify number of titles generated matches count

4. **API Integration**
   - Endpoint: `/tools/essay-title-generator` (POST)
   - Payload: `{topic?, keywords?, tone, count}`
   - Response: `{status, titles[], topic, keywords, tone, requested_count}`

5. **Results Display**
   - Title list → Verify all titles display
   - Copy individual titles → Test copy buttons
   - Regenerate → Test regenerate functionality
   - Clear → Test clear functionality

---

### 5. Research Question Generator (`/tools/research-question`)

**Route**: `app/(pages)/tools/research-question/page.tsx`  
**Component**: `app/components/AiTools/ResearchQuestion/ResearchQuestion.tsx`

#### Features

- Topic or keywords input
- Research type selection (Qualitative, Quantitative, Mixed)
- Count selection (1-10 questions)
- Multiple question generation

#### Test Cases

1. **Form Validation**
   - Empty topic and keywords → Error: "Please provide either a topic or keywords"
   - Topic only → Should allow submission
   - Keywords only → Should allow submission

2. **Research Type**
   - Test all 3 types: Qualitative, Quantitative, Mixed
   - Verify type affects generated questions

3. **Count Selection**
   - Test count range: 1-10
   - Verify number of questions matches count

4. **API Integration**
   - Endpoint: `/tools/research-question-generator` (POST)
   - Payload: `{topic?, keywords?, research_type, count}`
   - Response: `{status, questions[], research_type, requested_count}`

5. **Results Display**
   - Question list → Verify all questions display
   - Copy individual questions → Test copy buttons
   - Regenerate → Test regenerate functionality

---

### 6. Paraphraser Tool (`/tools/paraphraser-tool`)

**Route**: `app/(pages)/tools/paraphraser-tool/page.tsx`  
**Component**: `app/components/AiTools/AIParaphraser-tool.tsx`

#### Features

- Text input (manual or PDF upload)
- Style selection (Standard, Creative, Formal, Casual)
- 200-word limit validation
- PDF text extraction

#### Test Cases

1. **Input Methods**
   - Manual text input → Verify textarea works
   - PDF upload → Verify file upload works
   - PDF text extraction → Verify text extracted correctly
   - Word count → Verify word count display

2. **Word Limit**
   - Under 200 words → Should allow submission
   - Exactly 200 words → Should allow submission
   - Over 200 words → Should show error "Text exceeds 200-word limit"

3. **Style Selection**
   - Test all 4 styles: Standard, Creative, Formal, Casual
   - Verify style affects paraphrased output

4. **API Integration**
   - Endpoint: `/tools/paraphrase` (POST)
   - Payload: `{text, style}`
   - PDF parsing: `/tools/parse-document` (POST, multipart/form-data)
   - Response: `{paraphrased_text}`

5. **Results Display**
   - Paraphrased text → Verify displays correctly
   - Copy functionality → Test copy button
   - Loading state → Verify loading indicator
   - Error handling → Verify error messages

---

### 7. Summarizer Tool (`/tools/summarizer-tool`)

**Route**: `app/(pages)/tools/summarizer-tool/page.tsx`  
**Component**: `app/components/AiTools/summarizer-tool.tsx`

#### Features

- Text input (manual or PDF upload)
- Summary style (Paragraph, Bullet Points, Numbered List)
- Summary length slider (Short to Long)
- PDF text extraction

#### Test Cases

1. **Input Methods**
   - Manual text input → Verify textarea works
   - PDF upload → Verify file upload and extraction
   - Word count → Verify word count display

2. **Summary Style**
   - Paragraph → Verify paragraph format
   - Bullet Points → Verify bullet list format
   - Numbered List → Verify numbered list format

3. **Summary Length**
   - Short → Verify shorter summary
   - Medium → Verify medium summary
   - Long → Verify longer summary
   - Slider interaction → Verify slider works smoothly

4. **API Integration**
   - Endpoint: `/tools/summarizer` (POST)
   - Payload: `{text, format, length}`
   - PDF parsing: `/v1/tools/parse-document` (POST)
   - Response: `{summary}`

5. **Results Display**
   - Summary display → Verify formatting matches style
   - Copy functionality → Test copy button
   - Loading state → Verify loading indicator
   - Empty state → Verify empty state message

---

### 8. Thesis Generator (`/tools/thesis-generator-tool`)

**Route**: `app/(pages)/tools/thesis-generator-tool/page.tsx`  
**Component**: `app/components/AiTools/ThesisGenerator-tool.tsx`

#### Features

- Topic input (required)
- Main idea input (optional)
- Supporting reason input (optional)
- Audience input (optional)
- Thesis statement generation

#### Test Cases

1. **Form Validation**
   - Empty topic → Error: "Topic is required"
   - Topic only → Should allow submission
   - All fields filled → Should allow submission

2. **API Integration**
   - Endpoint: `/tools/generate-thesis` (POST)
   - Payload: `{topic, main_idea?, supporting_reason?, audience?}`
   - Response: `{final_thesis}`

3. **Results Display**
   - Thesis statement → Verify displays correctly
   - Copy functionality → Test copy button
   - Clear functionality → Test clear button

---

### 9. Pythagoras Solver (`/tools/pythagoras-solver`)

**Route**: `app/(pages)/tools/pythagoras-solver/page.tsx`  
**Component**: `app/components/AiTools/PythagorasSolver/PythagorasSolver.tsx`

#### Features

- Two side inputs (a, b, or c)
- Calculates missing side
- Shows solution steps
- Displays formula used

#### Test Cases

1. **Input Validation**
   - No sides provided → Error: "Please provide exactly two sides"
   - One side provided → Error: "Please provide exactly two sides"
   - Two sides provided → Should allow submission
   - Three sides provided → Error: "Please provide exactly two sides"
   - Negative numbers → Error: "Side must be a positive number"
   - Zero → Error: "Side must be a positive number"
   - Non-numeric input → Should validate as number

2. **Calculation**
   - Given a and b → Calculate c (hypotenuse)
   - Given a and c → Calculate b
   - Given b and c → Calculate a
   - Verify calculations are correct

3. **API Integration**
   - Endpoint: `/tools/pythagoras-solver` (POST)
   - Payload: `{a?, b?, c?}` (exactly 2 required)
   - Response: `{status, input, result: {a, b, c}, steps[], formula}`

4. **Results Display**
   - Decimal result → Verify displays correctly
   - Radical form → Verify displays if applicable
   - Solution steps → Verify all steps display
   - Formula → Verify formula displays
   - Copy functionality → Test copy buttons

---

### 10. Miles to Millimeters Converter (`/tools/miles-to-millimeters`)

**Route**: `app/(pages)/tools/miles-to-millimeters/page.tsx`

#### Features

- Conversion tool landing page
- Information display

#### Test Cases

1. **Page Load**
   - Verify page loads correctly
   - Verify breadcrumbs display
   - Verify hero section displays
   - Verify metadata (title, description)

2. **Content Display**
   - Verify all content sections display
   - Verify responsive design

---

## Multi-Step Flow Tools

### 11. Tutor Tool (`/tools/tutor`)

**Route**: `app/(pages)/tools/tutor/page.tsx`  
**Component**: `app/components/AiTools/Tutor/TutorFlow.tsx`

#### Flow Steps

1. **Step 1**: Enter child's name
2. **Step 2**: Select subject
3. **Step 3**: Select skill level
4. **Step 4**: Select topic from generated list
5. **Step 5**: Select difficulty level
6. **Step 6**: Take quiz (5 questions)
7. **Step 7**: Review answers
8. **Step 8**: View results and options

#### Test Cases

1. **Step 1 - Name Input**
   - Empty name → Should validate
   - Valid name → Should proceed to Step 2
   - API call → Sends message to chat context

2. **Step 2 - Subject Selection**
   - Select subject → Should proceed to Step 3
   - Subject validation → API validates subject
   - Invalid subject → Should show error

3. **Step 3 - Skill Level**
   - Select skill level → Should proceed to Step 4
   - Topic generation → API generates 8-12 topics
   - Topic parsing → Verify topics parsed correctly with emojis

4. **Step 4 - Topic Selection**
   - Display topics → Verify all topics display
   - Select topic → Should proceed to Step 5
   - Topic format → Verify emoji and name display

5. **Step 5 - Difficulty Level**
   - Select difficulty → Should proceed to Step 6
   - Quiz generation → API generates 5 questions
   - Question parsing → Verify questions parsed correctly

6. **Step 6 - Quiz Taking**
   - Display questions → Verify all 5 questions display
   - Select answers → Verify answer selection works
   - Submit quiz → Should proceed to Step 7

7. **Step 7 - Review**
   - Display answers → Verify correct/incorrect indicators
   - Show explanations → Verify explanations display
   - Complete review → Should proceed to Step 8

8. **Step 8 - Results**
   - Display score → Verify score calculation
   - Practice more → Should return to Step 6
   - Choose another topic → Should return to Step 4

9. **Floating Chat**
   - Visibility → Should appear from Step 2 onwards
   - Functionality → Test chat interactions

10. **API Integration**
    - Chat context → Uses `ChatContext` for all API calls
    - Quiz generation → Uses `generate_quiz` tool
    - Message sending → Uses `sendMessage` function

---

### 12. Exam Prep Tool (`/tools/exam-prep`)

**Route**: `app/(pages)/tools/exam-prep/page.tsx`  
**Component**: `app/components/AiTools/ExamPrep/ExamPrepFlow.tsx`

#### Flow Steps

1. **Step 1**: Enter exam details (type, subject, date, knowledge level, target score, hours per day)
2. **Step 2**: View study schedule
3. **Step 3**: Take practice exam (20 questions, 60 minutes)
4. **Step 4**: View exam results and options

#### Test Cases

1. **Step 1 - Form Input**
   - Exam type → Test dropdown options
   - Subject → Test text input
   - Exam date → Test date picker
   - Knowledge level → Test dropdown (Beginner, Intermediate, Advanced)
   - Target score → Test input
   - Hours per day → Test number input
   - Form validation → Verify all required fields
   - API call → Generate study schedule

2. **Step 2 - Study Schedule**
   - Display schedule → Verify schedule displays correctly
   - Back button → Should return to Step 1
   - Start practice → Should proceed to Step 3

3. **Step 3 - Practice Exam**
   - Exam generation → API generates 20 questions
   - Timer → Verify 60-minute timer works
   - Question display → Verify all questions display
   - Answer selection → Verify answer selection works
   - Submit exam → Should proceed to Step 4

4. **Step 4 - Results**
   - Score display → Verify score calculation
   - Back to schedule → Should return to Step 2
   - Take practice exam again → Should return to Step 3

5. **API Integration**
   - Study schedule → Uses chat API
   - Practice exam → Uses `create_practice_exam` tool
   - Parameters: `{exam_type, subject, num_questions: 20, time_limit: 60, difficulty}`

---

### 13. Language Practice Tool (`/tools/language-practice`)

**Route**: `app/(pages)/tools/language-practice/page.tsx`  
**Component**: `app/components/AiTools/LanguagePractice/LanguageFlow.tsx`

#### Flow Steps (8 Steps)

1. **Step 1**: Select Language
2. **Step 2**: Assessment (quick warm-up)
3. **Step 3**: Goals (what success looks like)
4. **Step 4**: Vocabulary (learn words)
5. **Step 5**: Grammar (sentence rules)
6. **Step 6**: Conversation (real-life practice)
7. **Step 7**: Pronunciation (text-based)
8. **Step 8**: Progress (celebrate wins)

#### Test Cases

1. **Onboarding (Steps 1-3)**
   - Step 1 → Language selection → Verify language options
   - Step 2 → Assessment → Verify assessment questions
   - Step 3 → Goals → Verify goal selection
   - Progress bar → Verify updates correctly
   - Navigation → Steps 4-8 locked until onboarding complete

2. **Practice Steps (Steps 4-8)**
   - Step 4 → Vocabulary → Verify vocabulary exercises
   - Step 5 → Grammar → Verify grammar exercises
   - Step 6 → Conversation → Verify chat interface
   - Step 7 → Pronunciation → Verify pronunciation practice
   - Step 8 → Progress → Verify progress tracking

3. **Navigation**
   - Step navigation → Verify can navigate between unlocked steps
   - Locked steps → Verify cannot access locked steps
   - Progress indicator → Verify shows correct progress percentage

4. **Context Management**
   - LanguagePracticeContext → Verify context provides all necessary data
   - State persistence → Verify state persists across steps
   - Onboarding completion → Verify unlocks practice steps

---

### 14. Micro Learning Tool (`/tools/mirco-learning`)

**Route**: `app/(pages)/tools/mirco-learning/page.tsx`  
**Component**: `app/components/AiTools/MicroLearning/MicroLearningFlow.tsx`

#### Flow Steps (11 Steps)

1. **Step 1**: Welcome/Introduction
2. **Step 2**: Select learning goals
3. **Step 3**: Set minutes per day
4. **Step 4**: Select topics
5. **Step 5**: Review plan
6. **Step 6**: Dashboard (day streak, lessons completed, etc.)
7. **Step 9**: Lesson content
8. **Step 10**: Test understanding (quiz)
9. **Step 11**: Quiz results

#### Test Cases

1. **Setup Steps (1-5)**
   - Step 1 → Welcome → Verify welcome screen
   - Step 2 → Goals → Verify goal selection (multiple)
   - Step 3 → Minutes → Verify time selection
   - Step 4 → Topics → Verify topic selection (multiple)
   - Step 5 → Review → Verify plan summary displays correctly

2. **Dashboard (Step 6)**
   - Statistics display → Verify day streak, lessons completed, hours learned
   - Start lesson → Should proceed to Step 9
   - Review flashcards → Verify functionality
   - View progress → Verify functionality

3. **Lesson (Step 9)**
   - Lesson content → Verify displays correctly
   - Duration → Verify matches selected duration
   - Topic → Verify matches selected topic
   - Back button → Should return to Step 6
   - Test understanding → Should proceed to Step 10

4. **Quiz (Step 10)**
   - Quiz generation → Verify questions display
   - Answer selection → Verify works correctly
   - Submit → Should proceed to Step 11

5. **Results (Step 11)**
   - Score display → Verify score calculation
   - Incorrect questions → Verify highlights incorrect answers
   - Start over → Should return to Step 1

---

## Authentication & Authorization

### Test Cases

1. **Token Management**
   - Token storage → Verify stored in localStorage as `access_token`
   - Token retrieval → Verify retrieved on page load
   - Token expiration → Verify redirects to sign-in
   - Token refresh → Verify refresh token mechanism

2. **Protected Routes**
   - Unauthenticated access → Should redirect to `/sign-in?returnUrl=/tools/{tool-name}`
   - Authenticated access → Should load tool
   - Token verification → Should call `/auth/verify-token` on load

3. **API Authorization**
   - Request headers → Verify `Authorization: Bearer {token}` header
   - 401 response → Should redirect to sign-in
   - 403 response → Should show access denied message

---

## Error Handling & Edge Cases

### Common Error Scenarios

1. **Network Errors**
   - No internet → Should show network error message
   - Slow connection → Should show loading state
   - Timeout → Should show timeout error

2. **API Errors**
   - 400 Bad Request → Should show validation error
   - 401 Unauthorized → Should redirect to sign-in
   - 403 Forbidden → Should show access denied
   - 404 Not Found → Should show not found error
   - 500 Server Error → Should show server error message

3. **Input Validation**
   - Empty required fields → Should show validation error
   - Invalid format → Should show format error
   - Exceeding limits → Should show limit error (e.g., 200 words)

4. **Edge Cases**
   - Very long text → Should handle gracefully
   - Special characters → Should handle correctly
   - Unicode characters → Should display correctly
   - Large file uploads → Should validate file size
   - Concurrent requests → Should handle properly

---

## UI/UX Testing

### Responsive Design

1. **Mobile (< 768px)**
   - Sidebar → Should be collapsible/hidden
   - Forms → Should stack vertically
   - Buttons → Should be full-width or appropriately sized
   - Text → Should be readable

2. **Tablet (768px - 1024px)**
   - Layout → Should adapt appropriately
   - Sidebar → Should be toggleable

3. **Desktop (> 1024px)**
   - Full layout → Should display all features
   - Sidebar → Should be visible by default

### Dark Mode

- Toggle functionality → Verify dark mode toggle works
- Color contrast → Verify text is readable
- Component styling → Verify all components support dark mode
- Persistence → Verify preference persists

### Accessibility

- Keyboard navigation → Verify all interactive elements accessible
- Screen readers → Verify ARIA labels present
- Focus indicators → Verify focus states visible
- Color contrast → Verify WCAG compliance

### Performance

- Page load time → Should load within 3 seconds
- API response time → Should respond within 5 seconds
- Smooth animations → Verify no janky animations
- Image optimization → Verify images load efficiently

---

## API Integration Testing

### Common API Patterns

1. **Request Structure**
   - Headers → `Authorization: Bearer {token}`, `Content-Type: application/json`
   - Payload → Verify correct structure
   - Endpoints → Verify correct URLs

2. **Response Handling**
   - Success response → Verify data extraction
   - Error response → Verify error handling
   - Loading states → Verify loading indicators

3. **Endpoints to Test**
   - `/tools/citation-generator` (POST)
   - `/tools/essay-outline` (POST)
   - `/tools/essay-title-generator` (POST)
   - `/tools/research-question-generator` (POST)
   - `/tools/paraphrase` (POST)
   - `/tools/summarizer` (POST)
   - `/tools/generate-thesis` (POST)
   - `/tools/pythagoras-solver` (POST)
   - `/tools/parse-document` (POST, multipart/form-data)
   - `/auth/verify-token` (GET)

---

## Test Checklist Summary

### Pre-Testing Setup

- [ ] Valid user account created
- [ ] Access token obtained
- [ ] Test data prepared
- [ ] Browser dev tools open (Network tab)
- [ ] Console open for error checking

### General Testing

- [ ] All tools accessible via sidebar
- [ ] Authentication redirects work
- [ ] Dark mode works on all tools
- [ ] Mobile responsive design works
- [ ] Copy to clipboard works
- [ ] Clear/reset buttons work
- [ ] Loading states display correctly
- [ ] Error messages display correctly

### Tool-Specific Testing

- [ ] Main Tool - Document creation and editing
- [ ] Citation Tool - All citation styles and source types
- [ ] Essay Outline - Outline generation
- [ ] Essay Title - Title generation with all tones
- [ ] Research Question - Question generation with all types
- [ ] Paraphraser - Text and PDF input, all styles
- [ ] Summarizer - Text and PDF input, all styles and lengths
- [ ] Thesis Generator - Thesis generation
- [ ] Pythagoras Solver - All calculation scenarios
- [ ] Tutor Tool - Complete 8-step flow
- [ ] Exam Prep - Complete 4-step flow
- [ ] Language Practice - Complete 8-step flow
- [ ] Micro Learning - Complete 11-step flow

### Edge Cases

- [ ] Empty form submissions
- [ ] Invalid input formats
- [ ] Network errors
- [ ] API errors (400, 401, 403, 404, 500)
- [ ] Very long text inputs
- [ ] Special characters
- [ ] File upload errors
- [ ] Concurrent requests

### Performance

- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] No memory leaks
- [ ] Smooth animations

---

## Notes for QA Team

1. **Environment Variables**: Ensure `NEXT_PUBLIC_NGROX_URL` is set correctly
2. **Token Management**: Keep track of token expiration during testing
3. **Test Data**: Use realistic test data that matches expected formats
4. **Browser Testing**: Test on Chrome, Firefox, Safari, Edge
5. **Device Testing**: Test on iOS and Android devices
6. **Documentation**: Document any bugs found with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos
   - Browser/device information

---

**Document Version**: 1.0  
**Last Updated**: January 28, 2026  
**Maintained By**: QA Team
