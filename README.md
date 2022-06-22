# Atlas - Plate Map creator

Atlas is a visual tool which we designed to give users a script free way to describe the contents of plate wells and any other metadata associated with the project.

To run this project you will need Node.js installed.

To run the demo:

```
npm install
npm run build
npm start
```

Visit http://localhost:3001 in your browser and you should see the Atlas home page. You can enter anything into the search box, it will always return one project named 'Demo Project'. Clicking the project will take you to the project overview which should have four 96 well plates and one 384 well plate. Searching for components will always return the same four components: a compound, a community, an integer attribute, and a boolean attribute.

## Sub Folders

`ui/` React app created with CRA. To run `cd ui/` then `npm install;npm start`

`demoserver/` Node Express server that serves up dummy data for demo

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Kaleido-Biosciences/fetch/tags).

## Authors

- **Keith Vedananda** - _Initial work_ [@kvedananda](https://github.com/kvedananda)
- **Daisy Flemming** - _Initial work_ - [@daisyflemming](https://github.com/daisyflemming)
- **Pat Kyle** - _Initial work_ - [@psk788](https://github.com/psk788)
- **Wes Fowlks** - _Initial work_ - [@wfowlks](https://github.com/wfowlks)

See also the list of [contributors](https://github.com/Kaleido-Biosciences/fetch/graphs/contributors) who participated in this project.

## License

This project is licensed under the BSD 3-clause "New" or "Revised" License - see the [LICENSE.md](LICENSE.md) file for details
