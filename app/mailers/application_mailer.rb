class ApplicationMailer < ActionMailer::Base
  default from: 'info@shovelsquad.com'
  default to: 'info@shovelsquad.com'
  default bcc: 'rosadiazjara@gmail.com'
  layout 'mailer'
end
