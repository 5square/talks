---
layout: broadcast
title: 5square | Automation // API // Smart Home
headline: Conferences
---
<!-- STANDARD POST -->
  {% for post in site.posts %}
  {% if post.categories contains 'conference' %}
  <article class="post-container conference-post-format">
    <div class="post-header">
	  <h2>{{ post.title }}</h2>
	  <span class="post-info">{{ post.date | date_to_string }}</span>
	</div>
	<p>{{ post.content }}</p>
  </article>
  {% endif %}
  {% endfor %}
<!-- STANDARD POST End -->
