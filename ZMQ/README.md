# ZeroMQ

## Configure Environment

You can run this program if you make `.env`:

```console
    HOST='127.0.0.1' ### Can change HOST
    PORT=65456 ### Can change PORT Number
```

## Request-Reply Pattern

This pattern is 1:1 socket programming enhance version!!

First, use this command in your termianl :

```console
    node req_rep_server.mjs
```
Another bash or termianl :

```console
    node req_rep_client.mjs
```

## Publish-Subscribe Pattern

This pattern is Requsrt-Reply enhance version.
You can use Push service.

First, use this command in your termianl :

```console
    node pub_sub_server.mjs
```
Another bash or termianl :

```console
    node pub_sub_client.mjs
```

## Pipeline Pattern(Push-Pull pattern)

You can use this pattern for parallel task.

First, use this command in your termianl :

```console
    node pipeline_server.mjs
```
Another bash or termianl :

```console
    node pipeline_client.mjs
```