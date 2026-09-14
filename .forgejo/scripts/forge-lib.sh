#!/usr/bin/env bash

: "${FORGE_API:=${GITHUB_SERVER_URL:?GITHUB_SERVER_URL is not set}/api/v1}"
: "${REPO_OWNER:=${GITHUB_REPOSITORY%%/*}}"
: "${REPO_NAME:=${GITHUB_REPOSITORY#*/}}"

if [ -z "${FORGE_TOKEN:-}" ]; then
  echo "::error::FORGE_TOKEN is empty. Either the secret isn't set on this repo"
  echo "::error::(Settings -> Actions -> Secrets, or the ScottyLabs org), or the"
  echo "::error::step is missing 'env: FORGE_TOKEN: \${{ secrets.FORGE_TOKEN }}'."
  exit 1
fi

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

LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LABELS_FILE="${LABELS_FILE:-$LIB_DIR/../labels.yml}"

yaml_unquote() {
  local s="$1"
  case "$s" in
    \"*\") s="${s#\"}"; s="${s%\"}" ;;
    \'*\') s="${s#\'}"; s="${s%\'}" ;;
  esac
  printf '%s' "$s"
}

each_label_spec() {
  local name="" color="" desc="" line t
  [ -f "$LABELS_FILE" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    t="$(trim "$line")"
    case "$t" in
      '#'*|'') continue ;;
      '- name:'*)
        [ -n "$name" ] && printf '%s\t%s\t%s\n' "$name" "$color" "$desc"
        name="$(yaml_unquote "$(trim "${t#- name:}")")"; color=""; desc="" ;;
      'color:'*)       color="$(yaml_unquote "$(trim "${t#color:}")")" ;;
      'description:'*) desc="$(yaml_unquote "$(trim "${t#description:}")")" ;;
    esac
  done < "$LABELS_FILE"
  [ -n "$name" ] && printf '%s\t%s\t%s\n' "$name" "$color" "$desc"
  return 0
}

_REPO_LABELS=""
repo_labels_json() {
  [ -n "$_REPO_LABELS" ] || _REPO_LABELS="$(api GET "/labels?limit=100")"
  printf '%s' "$_REPO_LABELS"
}

repo_has_label() {
  local n
  while IFS= read -r n; do
    [ "$n" = "$1" ] && return 0
  done < <(json_strings "$(repo_labels_json)" name)
  return 1
}

create_label() {
  local name="$1" found="" color="#ededed" desc="" n c d
  while IFS=$'\t' read -r n c d; do
    if [ "$n" = "$name" ]; then color="$c"; desc="$d"; found=1; break; fi
  done < <(each_label_spec)
  [ -n "$found" ] || echo "::warning::'$name' is not in .forgejo/labels.yml"
  color="#${color#\#}"
  echo "  ! creating missing label $name"
  api POST "/labels" \
    "{\"name\":\"$(json_escape "$name")\",\"color\":\"$color\",\"description\":\"$(json_escape "$desc")\"}" \
    > /dev/null
  _REPO_LABELS=""
}

ensure_labels() {
  local name
  for name in "$@"; do
    repo_has_label "$name" || create_label "$name"
  done
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
  if api POST "/issues/$number/labels" "$payload" > /dev/null 2>&1; then
    return 0
  fi
  ensure_labels "$@"
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
