class ApplicationMailer < ActionMailer::Base
  default from: 'info@shovelsquad.com'
  default to: 'info@shovelsquad.com'
  default bcc: 'info@shovelsquad.com'
  layout 'mailer'
end
