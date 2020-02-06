# Decode private deploy SSH key
openssl aes-256-cbc -k "$travis_key_password" -md sha256 -d -a -in travis_key.enc -out ./travis_key
chmod 400 ./travis_key
echo "Host github.com" > ~/.ssh/config
echo "  IdentityFile $(pwd)/travis_key" >> ~/.ssh/config
git remote set-url origin git@github.com:rustielin/iok.git

echo "github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDdBTOVVbUlhqUXQsRQpeIqItUn4HdSSFu6DipuYAVt1TkXuRgz+flKYrpNRsr9NdraTM+3iyZ8sTRpXx+D9hbL09SjwqrI1r/tOFmGUOl+8Z0mIsboL3RDnS4271+oW/idpPujyr4i8PPdwtOZ6BI+xcn8JydJBA8b6x5wFPWPAZeUwaRnLtvxqGCdVpNx08PDasrL+Y8yqFa8uGxvbJUc3hl0gYuO8kxoAoMVyIlfpSGzjiFnBNFkpj+Wf6s7dbFXnlJjSAM6OiEA9cxY6e9qJapmk3p8j8IMRDtyHcEuh0ScIInu+5X9yMh2ZN3bwKj0edK1GgrxpCAoYNpmdLRIrAV8vpRo8wZbTt0sc1m+l1y8OOrKM3aY9Fxrhhu58WjrTssXsARuBSISMSQs32of3QzJ2htmdPzkwIZdw5DsTG+yGfeX+fuIxSSEVcvG/Ap8c+JjzP8gFYULERzBd+0W2I3sPEXx1/+NtqUY257T2AKmtIInLPQZI5YefrHLf3zpTVFTlcc/w6f34NP/dTHRnQa4oLl3vbm2IaQ/X+41aVJoqqZ+gf795ATfHJqUC5b2nHxAS8w9/vQHbs9A3QV53/EJ6h2lHiop4e7+qsRP5/7lCmZC7M1PCzoKcNwo/OdeFC+GNPovSphg9oktBaYhenWBHMpSCZBciECwrdVlsw== rustie117@gmail.com" > ~/.ssh/known_hosts

git add README.md
git commit -m "Auto-generate awesome-list"

if ! git push -v ; then
    echo "git push error"
fi
