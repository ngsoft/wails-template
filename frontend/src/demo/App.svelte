<script>
    import "./demo.scss";
    import svelteLogo from "assets/pictures/svelte.svg";
    import viteLogo from "assets/pictures/vite.svg";
    import Counter from "./lib/Counter.svelte";
    import Micon from "@/components/Micon.svelte";
    import {MATERIAL_OUTLINED} from "@/fonts";
    import Aos from "@/components/Aos.svelte";
    import {AOS_SLIDE_UP, AOS_EASING_LINEAR} from "@/animate.js";
    import Layout from "app/Layout.svelte";


</script>
<Layout>

    <Aos once force transition="{AOS_SLIDE_UP}" duration={750} delay={250} easing={AOS_EASING_LINEAR}
         extraClass="h-full w-full">
        <div id="demo" class="h-full flex flex-col justify-center">
            <div class="flex justify-center">
                <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} class="logo" alt="Vite Logo"/>
                </a>
                <a href="https://svelte.dev" target="_blank" rel="noreferrer">
                    <img src={svelteLogo} class="logo svelte" alt="Svelte Logo"/>
                </a>
            </div>
            <h1>Vite + Svelte</h1>

            <div class="_card">
                <Counter/>
            </div>

            <p>
                <Micon name="info" variant={MATERIAL_OUTLINED}></Micon>
                Check out <a
                href="https://github.com/sveltejs/kit#readme"
                target="_blank"
                rel="noreferrer">SvelteKit</a
            >, the official Svelte app framework powered by Vite!
            </p>

            <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>


        </div>
    </Aos>

</Layout>
