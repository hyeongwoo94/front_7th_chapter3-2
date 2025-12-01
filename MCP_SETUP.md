# MCP Git 자동 커밋 설정 가이드

## 설치 완료 ✅
`yl-mcp-git-server`가 전역으로 설치되었습니다.

## Cursor에서 MCP 서버 설정하기

### 방법 1: Cursor 설정 UI 사용 (권장)

1. **Cursor 설정 열기**
   - `Ctrl + ,` (또는 `Cmd + ,` on Mac)
   - 또는 메뉴: `File` → `Preferences` → `Settings`

2. **MCP 설정 찾기**
   - 설정 검색창에 "MCP" 또는 "Model Context Protocol" 검색
   - "MCP Servers" 또는 "MCP Configuration" 섹션 찾기

3. **서버 추가**
   - "Add Server" 또는 "+" 버튼 클릭
   - 다음 설정 입력:

```json
{
  "mcpServers": {
    "yl-git-server": {
      "command": "yl-mcp-git-server"
    }
  }
}
```

### 방법 2: 설정 파일 직접 수정

Windows에서 Cursor 설정 파일 위치:
- `%APPDATA%\Cursor\User\settings.json`
- 또는 `C:\Users\사용자명\AppData\Roaming\Cursor\User\settings.json`

설정 파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "yl-git-server": {
      "command": "yl-mcp-git-server"
    }
  }
}
```

### 방법 3: npx 사용 (설치 없이 사용)

설정 파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "yl-git-server": {
      "command": "npx",
      "args": ["-y", "yl-mcp-git-server"]
    }
  }
}
```

## 설정 후

1. **Cursor 재시작**
   - 설정을 저장한 후 Cursor를 완전히 종료하고 다시 시작

2. **확인 방법**
   - AI 채팅에서 "Git 상태 확인" 또는 "코드 변경사항 보여줘"라고 요청
   - MCP 서버가 정상 작동하면 Git 관련 기능을 사용할 수 있습니다

## 사용 방법

### 자동 커밋 요청 예시

```
"내 코드 변경사항을 분석하고 자동으로 커밋해줘"
"변경된 파일을 스테이징하고 커밋 메시지를 생성해서 커밋해줘"
"현재 Git 상태를 확인해줘"
```

### 제공되는 기능

- `git_init`: Git 저장소 초기화
- `git_status`: 저장소 상태 확인
- `git_diff`: 코드 변경사항 확인
- `git_add`: 파일 스테이징
- `git_smart_commit`: AI가 변경사항을 분석하여 자동으로 커밋 메시지 생성 후 커밋 및 푸시

## 문제 해결

### MCP 서버가 작동하지 않는 경우

1. **Node.js 버전 확인**
   ```bash
   node --version
   ```
   - Node.js >= 16.0.0 필요

2. **패키지 재설치**
   ```bash
   npm uninstall -g yl-mcp-git-server
   npm install -g yl-mcp-git-server
   ```

3. **경로 확인**
   ```bash
   which yl-mcp-git-server
   # 또는 Windows에서:
   where yl-mcp-git-server
   ```

4. **Cursor 로그 확인**
   - Cursor 개발자 도구에서 콘솔 로그 확인
   - `Help` → `Toggle Developer Tools`

## 참고 자료

- [yl-mcp-git-server npm 패키지](https://www.npmjs.com/package/yl-mcp-git-server)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)

