# PON-40: Media Upload and File Management

## Linear Issue
[View in Linear](https://linear.app/metresearch/issue/PON-40/media-upload-and-file-management)

## Context & Motivation
Implement comprehensive file upload functionality for headshots and video samples, enabling talent to provide their media assets during onboarding.

## Functional Requirements
- Create `MediaUploadStep` component with chunked/resumable upload functionality
- Implement multiple headshot uploads and video sample support
- Add file validation, preview, and cropping
- Handle file size limits (10MB images, 50MB videos)
- Implement client-side compression and error handling
- Support file formats: JPG, PNG, MP4, MOV, WebM
- Use chunked/resumable upload libraries (uppy, tus, or Supabase's resumable upload API)

## Non-functional Requirements
- Fast upload performance with progress indicators
- Responsive design for mobile uploads
- Robust error handling and retry mechanisms
- Client-side compression to reduce file sizes
- Upload progress survives connectivity drops

## Success Criteria
- Users can upload multiple headshots successfully
- Video uploads work across supported formats
- File size validation prevents oversized uploads
- Preview functionality works correctly
- Error messages are clear and helpful
- Uploads can resume after network interruptions

## Test Plan
- Test file upload with various formats and sizes
- Verify file size validation (10MB/50MB limits)
- Test multiple file uploads
- Validate preview and cropping functionality
- Test error handling for failed uploads
- Verify mobile upload experience
- Test upload resume functionality after network drops

## Dependencies
- Chunked/resumable upload library (uppy, tus, or Supabase)
- Image processing libraries
- File validation utilities

## Suggested Implementation Plan
1. Research and select chunked/resumable upload library
2. Install and configure upload library
3. Create `MediaUploadStep` component
4. Implement file validation and size limits
5. Add preview and cropping functionality
6. Implement client-side compression
7. Add error handling and retry logic
8. Test across different file types and sizes
9. Test upload resume functionality

## Effort Estimate
3-4 days

## Priority & Impact
High Priority - Core functionality for media collection

## Acceptance Checklist
- [ ] Chunked/resumable upload works correctly
- [ ] Multiple headshot uploads supported
- [ ] Video uploads work for all formats
- [ ] File size validation implemented
- [ ] Preview functionality works
- [ ] Error handling is robust
- [ ] Mobile upload experience is smooth
- [ ] Uploads can resume after network interruptions

## Links & References
- [Project Spec](../spec.md)
- [Chunked Upload Libraries](https://uppy.io/docs/upload/)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage) 