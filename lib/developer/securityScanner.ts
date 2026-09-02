export interface SecurityIssue {
  severity: 'critical' | 'warning';
  file: string;
  rule: string;
  description: string;
}

export interface SecurityReport {
  isClean: boolean;
  score: number; // 0 to 100
  issues: SecurityIssue[];
  stats: {
    totalFiles: number;
    hasRootIndex: boolean;
    hasManifest: boolean;
  };
}

// Prohibited security patterns in HTML5 game bundles
const SECURITY_RULES = [
  {
    pattern: /\b(window\.top|top\.location|parent\.location)\b/g,
    severity: 'critical' as const,
    rule: 'FRAME_BUSTING',
    description: 'Attempting to navigate or hijack the parent window (top.location).',
  },
  {
    pattern: /\bdocument\.cookie\b/g,
    severity: 'critical' as const,
    rule: 'COOKIE_ACCESS',
    description: 'Attempting to read or write browser cookies.',
  },
  {
    pattern: /\b(eval\(|new\s+Function\()/g,
    severity: 'warning' as const,
    rule: 'DYNAMIC_CODE_EXECUTION',
    description: 'Dynamic eval() or Function constructor detected. Use standard scoped code.',
  },
  {
    pattern: /<\s*meta[^>]+http-equiv=["']refresh["']/i,
    severity: 'critical' as const,
    rule: 'META_REDIRECT',
    description: 'Meta http-equiv refresh redirect found in HTML file.',
  },
];

export const securityScanner = {
  /**
   * Zip Slip Path Traversal Check
   * Returns true if entryPath is safe and confined within targetDir
   */
  isPathSafe(targetDir: string, entryPath: string): boolean {
    const normalized = entryPath.replace(/\\/g, '/');
    if (normalized.includes('../') || normalized.startsWith('/') || normalized.includes('..\\')) {
      return false;
    }
    return true;
  },

  /**
   * Scans text content against HTML5 game security rules
   */
  scanContent(filename: string, content: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const rule of SECURITY_RULES) {
      if (rule.pattern.test(content)) {
        issues.push({
          severity: rule.severity,
          file: filename,
          rule: rule.rule,
          description: rule.description,
        });
      }
    }

    return issues;
  },

  /**
   * Evaluates overall security report
   */
  evaluate(issues: SecurityIssue[], hasRootIndex: boolean, hasManifest: boolean, totalFiles: number): SecurityReport {
    const hasCritical = issues.some((i) => i.severity === 'critical');
    const isClean = !hasCritical && hasRootIndex;
    
    let score = 100;
    if (!hasRootIndex) score -= 50;
    score -= issues.filter((i) => i.severity === 'critical').length * 40;
    score -= issues.filter((i) => i.severity === 'warning').length * 10;
    score = Math.max(0, score);

    return {
      isClean,
      score,
      issues,
      stats: {
        totalFiles,
        hasRootIndex,
        hasManifest,
      },
    };
  },
};
