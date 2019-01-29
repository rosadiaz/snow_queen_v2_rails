class ApplicationMailer < ActionMailer::Base
  default from: 'contact@shovelsquad.com'
  default to: 'contact@shovelsquad.com'
  default bcc: 'rosadiazjara@gmail.com'
  layout 'mailer'
end
