title 'check for /tmp'

control "tmp-1.0" do
  impact 0.7
  title "Ensure /tmp directory exists"
  desc "A description"
  desc "label", "A description with a label"
  tag data: "key value data"
  tag "security"
  ref "Document A-12", url: "http://..."

  describe file('/tmp') do
    it { should be_directory }
  end
end
