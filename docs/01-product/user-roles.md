# User Roles

## 1. Public Visitor

Can:
- browse published sessions
- browse published games
- see player names
- see venue information
- open/embed published YouTube videos when permitted
- open Google Drive links when permitted
- share public game URLs

Cannot:
- change metadata
- see private/draft sessions
- access OAuth credentials
- start uploads

## 2. Admin / Owner

Initially José.

Can:
- manage players
- manage venues/courts
- create/edit sessions
- create/edit games
- upload recordings
- assign recordings to games
- set Side A / Side B / custom side
- order recording parts
- connect Google account
- start Drive uploads
- start YouTube uploads
- retry failed uploads
- edit YouTube metadata before upload
- generate Facebook post drafts
- publish/unpublish games
- archive data

## Future roles

Only introduce if required:
- content manager
- scorer
- club admin
- uploader

The first implementation should avoid a complex RBAC system. A simple `profiles.role = 'admin'` is sufficient.
