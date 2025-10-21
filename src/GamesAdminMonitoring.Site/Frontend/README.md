# Frontend Development Guide

## Overview

This frontend application is built with React and uses Vite as the build tool. You can add new components following the established patterns.

## Adding New Components

### Creating Components

- Use React to create new components
- Follow the pattern established by `GoldAndDragonSetResult` component
- Place components in the appropriate directory structure

### Code Organization

- **Shared Logic**: If multiple components use the same logic, move it to the `shared` folder
- **Reusability**: Reference shared components and utilities to avoid code duplication

## Development Workflow

### Testing Components

- Edit `index.html` to set your frontend component as the entry point for testing
- This allows you to quickly test individual components during development

### Building the Application

To build the application, you may need to modify these configuration files:

- `vite.config.ts` - Vite build configuration
- `tsconfig.app.json` - TypeScript configuration for the application

## Getting Started

1. Create your new React component
2. Update `index.html` to test your component
3. Modify build configurations if needed
4. Move shared logic to the `shared` folder for reusability
