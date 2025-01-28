<script lang="ts">
	import { active } from './state.svelte';
</script>

{#if active.frontmatter?.Cover}
	<img alt="cover" src={active.frontmatter.Cover} />
{/if}

{#if active.frontmatter}
	<table><tbody>
		{#each Object.keys(active.frontmatter) as property}
			{#if property !== "Cover"}
				<tr>
					<th>{property}</th>
					<td>{active.frontmatter[property]}</td>
				</tr>
			{/if}
		{/each}
	</tbody></table>
{/if}

<style>
	th {
		vertical-align: top;
	}
</style>
