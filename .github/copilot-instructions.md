## Expert Guidelines for Web and App Development

This document outlines a set of expert-level rules and conventions for developing modern web and mobile applications. It covers a range of topics, including API design, UI/UX principles, and specific best practices for popular technologies.

1. API Design Guide: Sorting, Filtering, and Searching

This section outlines conventions for creating simple yet professional RESTful APIs.

1.1. Filtering

Use query parameters for all filtering. For simple, exact matches, use the field name as the parameter. For advanced filtering, append an underscore and an operator to the field name.

    Simple Filtering: GET /resources?field_name=value

        Example: GET /products?category=electronics

    Advanced Operators: Use _gt, _gte, _lt, _lte, _in, and _like.

        Example: GET /products?price_gt=50

    Date Range: Use _from and _to suffixes.

        Example: GET /orders?createdAt_from=2023-01-01T00:00:00Z&createdAt_to=2023-03-31T23:59:59Z

1.2. Sorting

Use the sort query parameter. Use a hyphen (-) prefix for descending order.

    Convention: GET /resources?sort=field1,-field2

        Example: GET /products?sort=-price,name

1.3. Pagination

Use simple page and pageSize parameters. Include metadata in the response to provide context to the client.

    Convention: GET /resources?page=page_number&pageSize=items_per_page

        Example: GET /products?page=1&pageSize=10

    Response Structure:
    JSON

    {
      "data": [
        // Array of resource objects
      ],
      "meta": {
        "totalCount": 50,
        "pageSize": 10,
        "currentPage": 1,
        "totalPages": 5
      }
    }

2. UI/UX Design Principles

You are an expert in UI/UX design. Use these principles to create intuitive, accessible, and performant user interfaces.

    Visual Design: Establish a clear visual hierarchy, use a cohesive color palette, and maintain sufficient contrast.

    Interaction Design: Create intuitive navigation, use familiar UI components, and provide clear calls-to-action.

    Accessibility: Adhere to WCAG guidelines. Use semantic HTML and provide alternative text for non-text content. Ensure full keyboard navigability.

    Responsive Design: Use a mobile-first approach. Use relative units (%, em, rem) and CSS Grid/Flexbox for fluid layouts. Use media queries to adjust layouts for different screen sizes.

    Performance: Optimize images and assets, implement lazy loading, and monitor Core Web Vitals.

    User Feedback: Incorporate clear feedback mechanisms for user actions, including loading indicators and helpful error messages.

    Consistency: Develop and adhere to a design system. Use consistent terminology and styling throughout the application.

3. General Web Development Guidelines

This section provides general guidelines for building web products and generating code.

3.1. Code Style and Structure

    Write concise, readable, and type-safe TypeScript.

    Use functional components and hooks over class components.

    Organize files by feature, grouping related code together.

    Avoid barrel imports (index.ts files).

    Do NOT write comments in the code unless explicitly asked.

3.2. Naming Conventions

    camelCase for variables and functions (isFetchingData).

    PascalCase for components (UserProfile).

    lowercase-hyphenated for directory names (user-profile).

3.3. TypeScript Usage

    Use TypeScript for all components.

    Enable strict typing in tsconfig.json.

    Avoid using any. Strive for precise types.

3.4. Performance Optimization

    Minimize heavy computations inside render methods.

    Use React.memo() to prevent unnecessary re-renders.

    For web, use Next.js features like next/image and next/link.

    For React Native, optimize FlatLists with removeClippedSubviews and getItemLayout.

3.5. UI and Styling

    For web, use Tailwind CSS or Shadcn/ui for reusable, responsive components.

    For React Native, use StyleSheet.create().

    Use responsive images with srcset and sizes attributes for the web.

3.6. Framework-Specific Guidelines

React Native & Expo

    Use Expo's managed workflow.

    Leverage Expo SDK for native features.

    Use react-navigation for navigation.

Next.js

    Use file-based routing and API routes.

    Implement ISR (Incremental Static Regeneration) or SSG (Static Site Generation) where appropriate.

Tailwind & Shadcn/ui

    Use Tailwind's utility classes for rapid UI development.

    Customize Shadcn/ui components to match the design system.

Container query sizes reference

    Tailwind includes container sizes ranging from 16rem (256px) to 80rem (1280px).

    Example: @md corresponds to @container (width >= 28rem) { … }
