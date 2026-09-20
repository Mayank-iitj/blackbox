class DeltaDebugger:
    """
    Minimizes a sequence of actions that cause a failure,
    isolating the exact 'Patient Zero' trigger.
    """
    def __init__(self, runner_callback):
        # runner_callback takes a sequence of actions and returns True if failure occurs
        self.runner_callback = runner_callback

    async def minimize(self, sequence):
        """
        Delta Debugging (ddmin) algorithm.
        Returns the minimized sequence of requests.
        """
        n = 2
        while len(sequence) >= 2:
            subsets = self._split(sequence, n)
            some_complement_failed = False
            
            for subset in subsets:
                complement = [x for x in sequence if x not in subset]
                if await self.runner_callback(complement):
                    sequence = complement
                    n = max(n - 1, 2)
                    some_complement_failed = True
                    break
                    
            if not some_complement_failed:
                some_subset_failed = False
                for subset in subsets:
                    if await self.runner_callback(subset):
                        sequence = subset
                        n = 2
                        some_subset_failed = True
                        break
                        
                if not some_subset_failed:
                    if n == len(sequence):
                        break
                    n = min(n * 2, len(sequence))
                    
        return sequence

    def _split(self, lst, n):
        k, m = divmod(len(lst), n)
        return list(lst[i*k+min(i, m):(i+1)*k+min(i+1, m)] for i in range(n))
