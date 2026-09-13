#!/usr/bin/env bash

: "${FORGE_API:?FORGE_API is required}"
: "${FORGE_TOKEN:?FORGE_TOKEN is required}"
: "${REPO_OWNER:?REPO_OWNER is required}"
: "${REPO_NAME:?REPO_NAME is required}"

REPO_API="$FORGE_API/repos/$REPO_OWNER/$REPO_NAME"

trim() {
  local s="$1"
  s="${s%$'\r'}"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
}

json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"; s="${s//\"/\\\"}"
  s="${s//$'\t'/\\t}"; s="${s//$'\r'/\\r}"; s="${s//$'\n'/\\n}"
  printf '%s' "$s"
}

json_numbers() {
  local rest="$1" re
  re='(^|[^\])"'"$2"'":[[:space:]]*(-?[0-9]+)'
  while [[ "$rest" =~ $re ]]; do
    printf '%s\n' "${BASH_REMATCH[2]}"
    rest="${rest#*"${BASH_REMATCH[0]}"}"
  done
}

json_strings() {
  local rest="$1" re
  re='(^|[^\])"'"$2"'":[[:space:]]*"(([^"\]|\\.)*)"'
  while [[ "$rest" =~ $re ]]; do
    printf '%s\n' "${BASH_REMATCH[2]}"
    rest="${rest#*"${BASH_REMATCH[0]}"}"
  done
}

json_count() {
  local n=0 line
  while IFS= read -r line; do n=$((n + 1)); done < <(json_strings "$1" "$2")
  printf '%s' "$n"
}

api() {
  local method="$1" path="$2" body="${3:-}"
  local args=(-fsSL --retry 2 -X "$method"
              -H "Authorization: token $FORGE_TOKEN"
              -H "Accept: application/json")
  [ -n "$body" ] && args+=(-H "Content-Type: application/json" -d "$body")
  curl "${args[@]}" "$REPO_API$path"
}

issue_labels_json() { api GET "/issues/$1/labels"; }

issue_has_label() {
  local name
  while IFS= read -r name; do
    [ "$name" = "$2" ] && return 0
  done < <(json_strings "$(issue_labels_json "$1")" name)
  return 1
}

add_labels() {
  local number="$1" payload='{"labels":[' first=1 name
  shift
  [ "$#" -eq 0 ] && return 0
  for name in "$@"; do
    [ "$first" -eq 1 ] || payload+=','
    first=0
    payload+="\"$(json_escape "$name")\""
  done
  payload+=']}'
  echo "  + ${*}"
  api POST "/issues/$number/labels" "$payload" > /dev/null
}

set_exclusive_label() {
  local number="$1" prefix="$2" desired="${3:-}" json i keep=0
  local ids=() names=()
  json="$(issue_labels_json "$number")"
  mapfile -t ids   < <(json_numbers "$json" id)
  mapfile -t names < <(json_strings "$json" name)
  for i in "${!names[@]}"; do
    case "${names[$i]}" in
      "$prefix"*)
        if [ "${names[$i]}" = "$desired" ]; then
          keep=1
        else
          echo "  - ${names[$i]}"
          api DELETE "/issues/$number/labels/${ids[$i]}" > /dev/null
        fi
        ;;
    esac
  done
  if [ -n "$desired" ] && [ "$keep" -eq 0 ]; then
    add_labels "$number" "$desired"
  fi
}

comment_on_issue() {
  api POST "/issues/$1/comments" "{\"body\":\"$(json_escape "$2")\"}" > /dev/null
}
