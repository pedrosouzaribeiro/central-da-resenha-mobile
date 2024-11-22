#include "nldbl-compat.h"

int
attribute_hidden
swscanf (const wchar_t *s, const wchar_t *fmt, ...)
{
  va_list arg;
  int done;

  va_start (arg, fmt);
  done = __nldbl_vswscanf (s, fmt, arg);
  va_end (arg);

  return done;
}
