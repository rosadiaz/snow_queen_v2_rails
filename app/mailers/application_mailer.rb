class ApplicationMailer < ActionMailer::Base
  default from: 'contact@shovelsquad.ca'
  default to: 'contact@shovelsquad.ca'
  default bcc: 'rosadiazjara@gmail.com'
  layout 'mailer'
end
