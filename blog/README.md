# Deploying the blog

The repository's root `netlify.toml` configures Netlify to use `blog` as the
base directory, run `bash scripts/build.sh`, and
publish `blog/_counter`. `pages` contains source files, not the finished site.
The force option regenerates the site instead of relying on committed build
records. Only the generated blog is published on Netlify.

The build script selects Python 3.10, creates an isolated virtual environment,
installs `requirements.txt`, and runs that environment's `chef bake --force`.
It explicitly performs setup because CLI deployments can skip automatic
dependency installation and runtime selection. It uses Netlify's `mise` runtime
manager when available, or an installed `python3.10` otherwise.

Python 3.10 and the versions in `requirements.txt` are intentional: PieCrust
3.3.0 uses older Jinja extensions, and its compressinja dependency fails on
Python 3.11 and newer.

To work locally, use Python 3.10, then run these commands from `blog`:

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
chef serve
```

Use `chef bake --force` to generate the static site locally. On Netlify,
deployments run this command automatically when changes reach the connected
`main` branch.

Write posts in `posts` and pages in `pages`. Remove `draft: true` (or change it
to `draft: false`) when a post is ready to publish. Both existing example posts
are drafts, so the homepage initially has no published posts.

The blog runs at `/` on `https://blog.tmyach.com`. Shared styles, fonts, scripts,
and images remain on `https://tmyach.com`, the main GitHub Pages website. The
blog template links there explicitly so those resources and navigation work
at every blog URL. Blog-specific styles are published with the blog.
