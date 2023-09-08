import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		/*methodOverride: {
			allowed: ['PATCH', 'DELETE']
		}*/
	}
};

export default config;


/*


import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

export default {
	preprocess: preprocess(),
    kit: {
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: 'build',
            assets: 'build',
            fallback: undefined,
            precompress: false,
            strict: true
        })
    }
};

*/