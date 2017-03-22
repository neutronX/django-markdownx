Vagrant.configure("2") do |config|

  config.vm.box = "bento/ubuntu-16.04"
  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder "../django-markdownx", "/srv/django-markdownx", create: true
  config.vm.provision :shell, :path => "bootstrap.sh", privileged: false
  config.vm.network "public_network", ip: "192.168.1.130", bridge: "en0: Wi-Fi (AirPort)"
  config.vm.hostname = "django-markdownx"
  config.ssh.forward_agent = true

  config.vm.provider "virtualbox" do |vb|
    vb.name = "django-markdownx"
    vb.gui = true
    vb.customize ["modifyvm", :id,
                  "--memory", "512",
                  "--ioapic", "on",
                  "--cpus", "2"]
  end
end
