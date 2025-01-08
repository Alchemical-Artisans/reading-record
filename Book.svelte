<script lang="ts">
	import { active } from 'state.svelte';
</script>

{#if active.frontmatter?.cover}
	<img alt="cover" src={active.frontmatter.cover} />
{/if}

{#if active.frontmatter}
	<table><tbody>
		{#each Object.keys(active.frontmatter) as property}
			{#if property !== "cover"}
				<tr>
					<th>{property}</th>
					<td>{active.frontmatter[property]}</td>
				</tr>
			{/if}
		{/each}
	</tbody></table>
{/if}
